import { type FC, useMemo, useState } from 'react';

import ReactEChartsCore from 'echarts-for-react/lib/core';
import { BarChart, LineChart, ScatterChart } from 'echarts/charts';
import { DatasetComponent, GridComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';

import { type Drift } from '@/api/models';
import chevronStyle from '@/components/ChevronToggle.module.css';
import { Time } from '@/components/dataSymbols';
import Foldable from '@/components/Foldable';
import SuggestionsInput from '@/components/SuggestionsInput';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { type EChartsOption } from 'echarts';
import ecStat from 'echarts-stat';
import { debounce } from 'lodash';
import { ChevronDown, Save } from 'lucide-react';
import { Alert } from './ui/alert';
import { Button } from './ui/button';
import { Label } from './ui/label';

export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

/**
 * Fetch a sub-key from an object, as noted by the filter JSON syntax.
 *
 * @param obj The object to navigate.
 * @param keyPath The path to the value to read.
 * @returns unknown The desired value, or undefined
 */
const fetchSubkey = (obj: Json, keyPath: string): unknown => {
  const keys = keyPath.split('.');
  let sub_item: Json = obj;
  for (const sub_key of keys) {
    if (sub_item == null || typeof sub_item !== 'object') {
      return undefined;
    }
    sub_item = (sub_item as Record<string, Json>)[sub_key];
  }
  return sub_item;
};

/**
 * Get the name of the specific/final key accessed by a key-path of the filter JSON syntax.
 *
 * @param keyPath The path to the value.
 * @returns The name of the specified key.
 */
const getSubkeyName = (keyPath: string): string => {
  const keys = keyPath.split('.');
  return keys[keys.length - 1];
};

type DataPoint = { x: number | Date; y: number; drift: Drift };
type RejectedResult = { result: Drift; reason: string };

const resolveSymbol = (entry: string | symbol) => {
  if (typeof entry === 'string') {
    return entry;
  }
  switch (entry) {
    case Time:
      return 'created_at';
  }
  return 'unknown';
};

const resolve = (drift: Drift, entry: string | symbol): unknown => {
  const key = resolveSymbol(entry);
  const value = fetchSubkey((typeof entry === 'symbol' ? drift : drift.parameters) as Json, key);

  switch (entry) {
    case Time:
      return new Date(value as string);
  }

  return value;
};

const generateDataPoints = (
  drifts: Drift[],
  xAxis: string | symbol,
  yAxis: string | symbol,
): [DataPoint[], RejectedResult[]] => {
  const rejected: { result: Drift; reason: string }[] = [];
  const collection: DataPoint[] = [];

  for (const drift of drifts) {
    const x = resolve(drift, xAxis);
    const y = resolve(drift, yAxis);

    if (typeof x !== 'number' && !(x instanceof Date)) {
      rejected.push({ result: drift, reason: 'X axis value not numeric' });
      continue;
    }
    if (typeof y !== 'number') {
      rejected.push({ result: drift, reason: 'Y axis value not numeric' });
      continue;
    }
    collection.push({ x, y, drift });
  }

  return [collection, rejected];
};

echarts.use([
  TooltipComponent,
  GridComponent,
  ScatterChart,
  CanvasRenderer,
  LineChart,
  DatasetComponent,
  BarChart,
]);
// @ts-expect-error missing type? check source file, it exists
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
echarts.registerTransform(ecStat.transform.regression);

const Scale = {
  Linear: 'linear',
  Logarithmic: 'logarithmic',
} as const;
type Scale = (typeof Scale)[keyof typeof Scale];

const GraphMode = {
  Scatter: 'scatter',
  Line: 'line',
  Bar: 'bar',
} as const;
type GraphMode = (typeof GraphMode)[keyof typeof GraphMode];

const Regression = {
  None: '',
  Linear: 'linear',
  Exponential: 'exponential',
  Logarithmic: 'logarithmic',
  Polynomial: 'polynomial',
} as const;
type Regression = (typeof Regression)[keyof typeof Regression];

const saveDiagramAsPng = (transparent = false) => {
  // TODO: ref?
  const canvasElement = document.querySelector('.echarts-for-react canvas');
  if (canvasElement == null) {
    console.error('Could not find echarts canvas');
    return;
  }
  const canvas = canvasElement as HTMLCanvasElement;

  if (transparent) {
    const download = document.createElement('a');
    download.href = canvas.toDataURL('image/png');
    download.download = 'diagram.png';
    download.click();
  } else {
    const whiteCanvas = document.createElement('canvas');
    whiteCanvas.width = canvas.width;
    whiteCanvas.height = canvas.height;
    const context = whiteCanvas.getContext('2d');
    if (context) {
      context.fillStyle = 'white';
      context.fillRect(0, 0, whiteCanvas.width, whiteCanvas.height);
      context.drawImage(canvas, 0, 0);
      const download = document.createElement('a');
      download.href = whiteCanvas.toDataURL('image/png');
      download.download = 'diagram.png';
      download.click();
    } else {
      console.error('Could not create 2d canvas context');
    }
  }
};

type EChartsDiagramProps = {
  drifts: Drift[];
};

const timestamp = (t: number | Date) =>
  t instanceof Date ? t.toLocaleString() : new Date(t).toLocaleString();

/**
 * Chart displaying a line diagram following the drifts' ordering
 *
 * @param drifts drifts to render
 */
const EChartsDiagram: FC<EChartsDiagramProps> = ({ drifts }) => {
  const [xAxisMode, setXAxisMode] = useState<Scale>(Scale.Linear);
  const [yAxisMode, setYAxisMode] = useState<Scale>(Scale.Linear);

  const [graphMode, setGraphMode] = useState<GraphMode>(GraphMode.Scatter);
  const [regressionMode, setRegressionMode] = useState<Regression>(Regression.None);
  const [polyRegressionOrder, setPolyRegressionOrder] = useState<number>(2);

  const [xAxis, setXAxis] = useState<string | symbol>('');
  const updateXAxis = useMemo(() => debounce(setXAxis, 250), [setXAxis]);
  const [yAxis, setYAxis] = useState<string | symbol>('');
  const updateYAxis = useMemo(() => debounce(setYAxis, 250), [setYAxis]);

  const [showExtra, setShowExtra] = useState(false);

  let dataPoints: DataPoint[] = [];
  let rejected: RejectedResult[] = [];

  const xAxisSet = typeof xAxis === 'symbol' || xAxis.length > 0;
  const yAxisSet = typeof yAxis === 'symbol' || yAxis.length > 0;

  // if axes entered, parse data by x and y
  if (xAxisSet && yAxisSet) {
    [dataPoints, rejected] = generateDataPoints(drifts, xAxis, yAxis);
  }

  const datasets: EChartsOption['dataset'] = [];
  const series: EChartsOption['series'] = [];
  datasets.push({
    //source: dataPoints.filter((data, i) => i % 2).map((d) => [d.x, d.y]),
    source: dataPoints.filter((data) => data.drift.drift_detected).map((d) => [d.x, d.y]),
  });
  series.push({
    type: graphMode,
    name: 'detected',
    datasetIndex: 0,
    color: '#ff2020',
  });
  datasets.push({
    //source: dataPoints.filter((data, i) => (i + 1) % 2).map((d) => [d.x, d.y]),
    source: dataPoints.filter((data) => !data.drift.drift_detected).map((d) => [d.x, d.y]),
  });
  series.push({
    type: graphMode,
    name: 'not detected',
    datasetIndex: 1,
    color: '#30e030',
  });

  const enableRegression = regressionMode !== Regression.None;
  if (enableRegression) {
    datasets.push({
      transform: {
        type: 'ecStat:regression',
        config: {
          method: regressionMode,
          // 'end' by default
          // formulaOn: 'start'
          order: polyRegressionOrder,
        },
      },
    });
    series.push({
      name: 'Regression',
      type: 'line',
      smooth: true,
      datasetIndex: datasets.length - 1,
      symbolSize: 0.1,
      symbol: 'circle',
      label: { show: true, fontSize: 16 },
      labelLayout: {
        rotate: 0,
        x: '15%',
        y: '010%',
        fontSize: 12,
      },
      encode: { label: 2, tooltip: 1 },
    });
  }

  const xAxisOptions: EChartsOption['xAxis'] =
    xAxisMode === Scale.Logarithmic
      ? {
          splitLine: {
            lineStyle: {
              type: 'dashed',
            },
          },
          type: 'log',
          name: getSubkeyName(resolveSymbol(xAxis)),
        }
      : {
          ...(xAxis !== Time && {
            splitLine: {
              lineStyle: {
                type: 'dashed',
              },
            },
          }),
          ...(xAxis === Time && {
            splitLine: { show: false },
            scale: true,
            axisLabel: {
              formatter: timestamp,
              rotate: 22.5,
            },
            axisPointer: {
              label: {
                formatter: (v) => (typeof v.value === 'string' ? v.value : timestamp(v.value)),
              },
            },
          }),
          type: 'value',
          name: getSubkeyName(resolveSymbol(xAxis)),
        };

  const options: EChartsOption = {
    legend: {
      show: true,
    },
    dataset: datasets,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    xAxis: xAxisOptions,
    yAxis: {
      splitLine: {
        lineStyle: {
          type: 'dashed',
        },
      },
      type: yAxisMode === Scale.Logarithmic ? 'log' : 'value',
      name: getSubkeyName(resolveSymbol(yAxis)),
    },
    series,
    animation: false,
  };

  const input = cn('grid w-full max-w-sm items-center gap-1.5');

  return (
    <>
      <div className="container grid grid-cols-1 md:grid-cols-2 gap-x-1 gap-y-3">
        <div className={input}>
          <Label htmlFor="x-axis">X Axis:</Label>
          <SuggestionsInput
            id="x-axis"
            placeholder="JSON Path"
            setInput={updateXAxis}
            suggestions={[]}
          />
        </div>
        <div className={input}>
          <Label htmlFor="y-axis">Y Axis:</Label>
          <SuggestionsInput
            id="y-axis"
            placeholder="Enter a JSON path (e.g. result.score)"
            setInput={updateYAxis}
            suggestions={[]}
          />
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={() => setShowExtra((prev) => !prev)}
          size="sm"
          className="mb-2 px-8"
          variant="outline"
        >
          <ChevronDown
            className={cn(chevronStyle['chevronToggle'], showExtra && chevronStyle['cwToggled'])}
          />
        </Button>
      </div>
      <Foldable show={showExtra}>
        <div className="container grid grid-cols-1 md:grid-cols-2 gap-x-1 gap-y-3">
          <div className={input}>
            <Label>Graph mode</Label>
            <Select onValueChange={(e) => setGraphMode(e as GraphMode)} value={graphMode}>
              <SelectTrigger>
                <SelectValue placeholder="Graph mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={GraphMode.Scatter}>Scatter</SelectItem>
                <SelectItem value={GraphMode.Line}>Line</SelectItem>
                <SelectItem value={GraphMode.Bar}>Bar</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className={input}>
            <Label>Regression</Label>
            <Select
              onValueChange={(e) => {
                const { type, order } = JSON.parse(e) as { type: string; order?: number };
                setRegressionMode(type as Regression);
                if (order !== undefined) {
                  setPolyRegressionOrder(order);
                }
              }}
              value={JSON.stringify({
                type: regressionMode,
                order: regressionMode === Regression.Polynomial ? polyRegressionOrder : undefined,
              })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={JSON.stringify({ type: Regression.Linear })}>Linear</SelectItem>
                <SelectItem value={JSON.stringify({ type: Regression.Exponential })}>
                  Exponential
                </SelectItem>
                <SelectItem value={JSON.stringify({ type: Regression.Logarithmic })}>
                  Logarithmic
                </SelectItem>
                <SelectItem value={JSON.stringify({ type: Regression.Polynomial, order: 2 })}>
                  2-Polynomial
                </SelectItem>
                <SelectItem value={JSON.stringify({ type: Regression.Polynomial, order: 3 })}>
                  3-Polynomial
                </SelectItem>
                <SelectItem value={JSON.stringify({ type: Regression.Polynomial, order: 4 })}>
                  4-Polynomial
                </SelectItem>
                <SelectItem value={JSON.stringify({ type: Regression.Polynomial, order: 5 })}>
                  5-Polynomial
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className={input}>
            <Label>X Scale</Label>
            <Select onValueChange={(e) => setXAxisMode(e as Scale)} value={xAxisMode}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Scale.Linear}>Linear</SelectItem>
                <SelectItem value={Scale.Logarithmic}>Logarithmic</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className={input}>
            <Label>Y Scale</Label>
            <Select onValueChange={(e) => setYAxisMode(e as Scale)} value={yAxisMode}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Scale.Linear}>Linear</SelectItem>
                <SelectItem value={Scale.Logarithmic}>Logarithmic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Foldable>

      {rejected.length > 0 && (
        <div className="my-1">
          {datasets.length > 0 &&
            rejected.map((rejectedResult) => (
              <Alert variant="destructive" key={rejectedResult.result.id}>
                Result {rejectedResult.result.id} not displayed due to: {rejectedResult.reason}
              </Alert>
            ))}
          {datasets.length === 0 && (
            <Alert variant="destructive">
              No displayable result selected. One of your axes may not be referencing numeric data!
            </Alert>
          )}
        </div>
      )}
      {xAxisSet && yAxisSet && datasets.length > 0 && (
        <>
          <div
            style={{
              resize: 'both',
              height: '30rem',
              maxWidth: '100%',
              minWidth: '500px',
              minHeight: '200px',
            }}
            className="overflow-hidden mt-2"
          >
            <ReactEChartsCore
              echarts={echarts}
              option={options}
              style={{ height: '100%' }}
              notMerge
            />
          </div>
          <div className="flex justify-end mt-2">
            <Button variant="secondary" onClick={() => saveDiagramAsPng(false)} className="me-2">
              <Save /> Save as PNG
            </Button>

            <Button variant="secondary" onClick={() => saveDiagramAsPng(true)}>
              <Save /> Save as PNG (transparent)
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default EChartsDiagram;
