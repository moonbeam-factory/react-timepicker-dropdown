import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text } from '@storybook/addon-knobs';
import TimePickerWrapper from '../examples/TimePickerWrapper';
import '../css/material/default.css';

storiesOf('Different Languages', module)
  .addDecorator(withKnobs)
  .addWithInfo('English (basic)', () => (
    <TimePickerWrapper timeMode="12" />
  ))
  .addWithInfo('汉语 - 简体', () => (
    <TimePickerWrapper
      timeMode="12"
      language="zh-cn"
    />
  ))
  .addWithInfo('汉语 - 繁体', () => (
    <TimePickerWrapper
      timeMode="12"
      language="zh-tw"
    />
  ))
  .addWithInfo('Français', () => (
    <TimePickerWrapper
      timeMode="12"
      language="fr"
    />
  ))
  .addWithInfo('日本語', () => (
    <TimePickerWrapper
      timeMode="12"
      language="ja"
    />
  ))
  .addWithInfo('custom phrases', () => {
    const confirm = text('confirm', 'okey dokey');
    const cancel = text('cancel', 'hold it there!');
    const close = text('close', 'DONE');
    const am = text('am', 'Ante');
    const pm = text('pm', 'Post');

    return (
      <TimePickerWrapper
        timeMode="12"
        language="en"
        phrases={{
          confirm,
          cancel,
          close,
          am,
          pm
        }}
      />
    );
  });
