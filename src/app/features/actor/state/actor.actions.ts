import { createActionGroup, props } from '@ngrx/store';

export const ActorActions = createActionGroup({
  source: 'Actor',
  events: {
    'Load Actor Profile': props<{ actorId: string }>(),
    'Load Actor Profile Success': props<{ data: unknown }>(),
    'Load Actor Profile Failure': props<{ error: unknown }>(),
  }
});
