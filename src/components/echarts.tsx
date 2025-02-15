import { type FC, useMemo, useState } from 'react';

import ReactEChartsCore from 'echarts-for-react/lib/core';
import { BarChart, LineChart, ScatterChart } from 'echarts/charts';
import { DatasetComponent, GridComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';

import { type Drift } from '@/api/models';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import ecStat from 'echarts-stat';
import { debounce } from 'lodash';
import { Save } from 'lucide-react';
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

type DataPoint = { x: number; y: number; drift: Drift };
type RejectedResult = { result: Drift; reason: string };

const generateDataPoints = (
  drifts: Drift[],
  xAxis: string,
  yAxis: string,
): [DataPoint[], RejectedResult[]] => {
  const rejected: { result: Drift; reason: string }[] = [];
  const collection: DataPoint[] = [];

  for (const drift of drifts) {
    const x = fetchSubkey(drift.parameters as Json, xAxis);
    const y = fetchSubkey(drift.parameters as Json, yAxis);

    if (typeof fetchSubkey(drift.parameters as Json, xAxis) !== 'number') {
      rejected.push({ result: drift, reason: 'X axis value not numeric' });
      continue;
    }
    if (typeof fetchSubkey(drift.parameters as Json, yAxis) !== 'number') {
      rejected.push({ result: drift, reason: 'Y axis value not numeric' });
      continue;
    }
    collection.push({ x: x as number, y: y as number, drift });
  }

  collection.sort((a: DataPoint, b: DataPoint) => a.x - b.x);

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
};
type Scale = (typeof Scale)[keyof typeof Scale];

const GraphMode = {
  Scatter: 'scatter',
  Line: 'line',
  Bar: 'bar',
};
type GraphMode = (typeof GraphMode)[keyof typeof GraphMode];

enum Regression {
  None = '',
  Linear = 'linear',
  Exponential = 'exponential',
  Logarithmic = 'logarithmic',
  Polynomial = 'polynomial',
}

type RegressionSelectProps = {
  setRegressionMode: (mode: Regression) => void;
  regressionMode: Regression;
  disabled?: boolean;
  polyRegressionOrder: number;
  setPolyRegressionOrder: (num: number) => void;
  className?: string;
};
const RegressionSelect: FC<RegressionSelectProps> = ({
  setRegressionMode,
  regressionMode,
  disabled = false,
  polyRegressionOrder,
  setPolyRegressionOrder,
  className,
}) => (
  <div className={cn('grid w-full max-w-sm items-center gap-1.5', className)}>
    <div>
      <Label>Regression</Label>
      {disabled || (
        <Select
          onValueChange={(e) => setRegressionMode(e as Regression)}
          value={regressionMode}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={Regression.Linear}>Linear</SelectItem>
            <SelectItem value={Regression.Exponential}>Exponential</SelectItem>
            <SelectItem value={Regression.Polynomial}>Polynomial</SelectItem>
            <SelectItem value={Regression.Logarithmic}>Logarithmic</SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
    {regressionMode === Regression.Polynomial && (
      <Select
        onValueChange={(e) => setPolyRegressionOrder(+e)}
        value={polyRegressionOrder.toString()}
      >
        <SelectTrigger>
          <SelectValue placeholder="Regression order" />
        </SelectTrigger>
        {/* 1 - 10 */}
        <SelectContent>
          {[...Array(10).keys()].map((n) => (
            <SelectItem value={(n + 1).toString()} key={n + 1}>
              {n + 1}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )}
  </div>
);

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

/**
 * Chart displaying a line diagram following the drifts' ordering
 *
 * @param drifts drifts to render
 */
const EChartsDiagram: FC<EChartsDiagramProps> = ({ drifts }) => {
  const [xAxisMode, setXAxisMode] = useState(Scale.Linear);
  const [yAxisMode, setYAxisMode] = useState(Scale.Linear);

  const [graphMode, setGraphMode] = useState<string>(GraphMode.Line);
  const [regressionMode, setRegressionMode] = useState<Regression>(Regression.None);
  const [polyRegressionOrder, setPolyRegressionOrder] = useState<number>(2);

  const [xAxis, setXAxis] = useState('');
  const updateXAxis = useMemo(() => debounce(setXAxis, 250), [setXAxis]);
  const [yAxis, setYAxis] = useState('');
  const updateYAxis = useMemo(() => debounce(setYAxis, 250), [setYAxis]);

  const labelSet = new Set<number>();

  let dataPoints: DataPoint[] = [];
  let rejected: RejectedResult[] = [];

  // if axes entered, parse data by x and y
  if (xAxis.length && yAxis.length) {
    [dataPoints, rejected] = generateDataPoints(drifts, xAxis, yAxis);
    for (const dataPoint of dataPoints) {
      labelSet.add(dataPoint.x);
    }
  }

  const datasets: ({ source: number[][] } | { transform: unknown })[] = [];
  const series = [];
  datasets.push({ source: dataPoints.map((d) => [d.x, d.y]) });
  series.push({
    type: graphMode,
    //name: dataSet.site.name,
    datasetIndex: datasets.length - 1,
  });

  const regressionDataset = {
    transform: {
      type: 'ecStat:regression',
      config: {
        method: regressionMode,
        // 'end' by default
        // formulaOn: 'start'
        order: polyRegressionOrder,
      },
    },
  };
  const regressionSeries = {
    name: 'Regression',
    type: 'line',
    smooth: true,
    datasetIndex: datasets.length,
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
  };

  const enableRegression = regressionMode !== Regression.None;
  if (enableRegression) {
    datasets.push(regressionDataset);
    series.push(regressionSeries);
  }

  const options = {
    dataset: [...datasets],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    xAxis: {
      splitLine: {
        lineStyle: {
          type: 'dashed',
        },
      },
      type: xAxisMode === Scale.Logarithmic ? 'log' : 'value',
      name: getSubkeyName(xAxis),
    },
    yAxis: {
      splitLine: {
        lineStyle: {
          type: 'dashed',
        },
      },
      type: yAxisMode === Scale.Logarithmic ? 'log' : 'value',
      name: getSubkeyName(yAxis),
      nameRotate: 90,
    },
    series: [...series],
    animation: false,
  };

  return (
    <>
      <div className="columns-1 md:columns-2 mb-2">
        <div className={cn('grid w-full max-w-sm items-center gap-1.5')}>
          <div>
            <Label>Graph mode</Label>
            <Select onValueChange={(e) => setGraphMode(e)} value={graphMode}>
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
        </div>
      </div>
      <div className="columns-1 md:columns-2 mb-2">
        <div className={cn('grid w-full max-w-sm items-center gap-1.5')}>
          <Label>X Scale</Label>
          <Select onValueChange={(e) => setXAxisMode(e)} value={xAxisMode}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={Scale.Linear}>Linear</SelectItem>
              <SelectItem value={Scale.Logarithmic}>Logarithmic</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className={cn('grid w-full max-w-sm items-center gap-1.5')}>
          <Label>Y Scale</Label>
          <Select onValueChange={(e) => setYAxisMode(e)} value={yAxisMode}>
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
      <div className="columns-1 md:columns-2 mb-2">
        <RegressionSelect
          setRegressionMode={setRegressionMode}
          regressionMode={regressionMode}
          polyRegressionOrder={polyRegressionOrder}
          setPolyRegressionOrder={setPolyRegressionOrder}
          className="mb-2"
        />
      </div>
      <div className="columns-1 md:columns-2">
        <div className={cn('grid w-full max-w-sm items-center gap-1.5')}>
          <Label htmlFor="x-axis">X Axis:</Label>
          <Input
            id="x-axis"
            placeholder="Enter a JSON path (e.g. machine.cpu.count)"
            onChange={(i) => updateXAxis(i.target.value)}
          />
        </div>
        <div className={cn('grid w-full max-w-sm items-center gap-1.5')}>
          <Label htmlFor="y-axis">Y Axis:</Label>
          <Input
            id="y-axis"
            placeholder="Enter a JSON path (e.g. result.score)"
            onChange={(i) => updateYAxis(i.target.value)}
          />
        </div>
      </div>

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
      {xAxis.length > 0 && yAxis.length > 0 && datasets.length > 0 && (
        <>
          <div
            style={{
              resize: 'both',
              height: '30em',
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
          <div className="flex justify-end">
            <Button variant="secondary" onClick={() => saveDiagramAsPng(false)}>
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
