import experimentIdPut from '@/api/functions/experimentIdPut';
import { type Experiment } from '@/api/models/index';
import { useAuth } from '@/components/AuthContext';
import { Checkbox } from '@/components/ui/checkbox';
import { API_BASEPATH } from '@/lib/env';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type PublicCheckboxProps = {
  experiment: Experiment;
  editable?: boolean;
};
const PublicCheckbox = ({ experiment, editable }: PublicCheckboxProps) => {
  const auth = useAuth();

  const queryClient = useQueryClient();
  const update = useMutation({
    mutationFn: async (pub: boolean) => {
      const response = await experimentIdPut({
        params: { experiment_id: experiment.id },
        body: {
          name: experiment.name,
          description: experiment.description,
          permissions: experiment.permissions,
          public: pub,
          // TODO: generator support read-only fields as omitted for requests
        } as Experiment,
        config: {
          basePath: API_BASEPATH,
          auth: {
            bearer: auth.status === 'logged-in' ? auth.auth.token : undefined,
          },
        },
      });
      await queryClient.invalidateQueries({
        queryKey: ['experiment', experiment.id],
      });
      return response;
    },
  });

  return (
    <div className="flex items-baseline justify-center mt-4">
      <Checkbox
        checked={experiment.public}
        onCheckedChange={() => {
          update.mutate(!experiment.public);
        }}
        id="public"
        className="me-2"
        disabled={!editable}
      />
      <label htmlFor="public">Public</label>
    </div>
  );
};

export default PublicCheckbox;
