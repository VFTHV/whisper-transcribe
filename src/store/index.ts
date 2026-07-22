import { configureStore } from "@reduxjs/toolkit";
import {
  ACTION_FINISHED,
  ACTION_STARTED,
  createMiddleware,
  createReducer,
  PROMISE_REJECTED,
  PROMISE_RESOLVED,
  SUBSCRIPTION_UPDATED,
} from "async-selector-kit";
import { recordingReducer } from "../features/recording/slice/reducers";
import { settingsReducer } from "../features/settings/slice/reducers";
import { transcriptionReducer } from "../features/transcription/slice/reducers";

const asyncSelectorSerializableIgnored = [
  PROMISE_RESOLVED,
  PROMISE_REJECTED,
  ACTION_STARTED,
  ACTION_FINISHED,
  SUBSCRIPTION_UPDATED,
] as const;

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [...asyncSelectorSerializableIgnored],
      },
    }).concat(createMiddleware()),
  reducer: {
    settings: settingsReducer,
    transcription: transcriptionReducer,
    recording: recordingReducer,
    AsyncSelector: createReducer(),
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
