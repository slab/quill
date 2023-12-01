import { describe, expect, test } from 'vitest';
import Quill from '../../../../src/core';
import Video from '../../../../src/formats/video';
import { BaseTooltip } from '../../../../src/themes/base';
import { createRegistry } from '../../__helpers__/factory';

class Tooltip extends BaseTooltip {
  static TEMPLATE = '<input type="text">';
}

describe('BaseTooltip', () => {
  const setup = () => {
    const container = document.body.appendChild(document.createElement('div'));
    const quill = new Quill(container, { registry: createRegistry([Video]) });
    const tooltip = new Tooltip(quill);
    return { container, tooltip };
  };

  const insertVideo = (tooltip: Tooltip, url: string) => {
    (tooltip.textbox as HTMLInputElement).value = url;
    tooltip.root.setAttribute('data-mode', 'video');
    tooltip.save();
  };

  describe('save', () => {
    test('converts youtube video url to embedded', () => {
      const { container, tooltip } = setup();
      insertVideo(tooltip, 'http://youtube.com/watch?v=QHH3iSeDBLo');
      expect(
        (container.querySelector('.ql-video') as HTMLVideoElement).src,
      ).toContain('http://www.youtube.com/embed/QHH3iSeDBLo');
    });

    test('converts www.youtube video url to embedded', () => {
      const { container, tooltip } = setup();
      insertVideo(tooltip, 'http://www.youtube.com/watch?v=QHH3iSeDBLo');
      expect(
        (container.querySelector('.ql-video') as HTMLVideoElement).src,
      ).toContain('http://www.youtube.com/embed/QHH3iSeDBLo');
    });

    test('converts m.youtube video url to embedded', () => {
      const { container, tooltip } = setup();
      insertVideo(tooltip, 'http://m.youtube.com/watch?v=QHH3iSeDBLo');
      expect(
        (container.querySelector('.ql-video') as HTMLVideoElement).src,
      ).toContain('http://www.youtube.com/embed/QHH3iSeDBLo');
    });

    test('preserves youtube video url protocol', () => {
      const { container, tooltip } = setup();
      insertVideo(tooltip, 'https://m.youtube.com/watch?v=QHH3iSeDBLo');
      expect(
        (container.querySelector('.ql-video') as HTMLVideoElement).src,
      ).toContain('https://www.youtube.com/embed/QHH3iSeDBLo');
    });

    test('uses https as default youtube video url protocol', () => {
      const { container, tooltip } = setup();
      insertVideo(tooltip, 'youtube.com/watch?v=QHH3iSeDBLo');
      expect(
        (container.querySelector('.ql-video') as HTMLVideoElement).src,
      ).toContain('https://www.youtube.com/embed/QHH3iSeDBLo');
    });

    test('converts vimeo video url to embedded', () => {
      const { container, tooltip } = setup();
      insertVideo(tooltip, 'http://vimeo.com/47762693');
      expect(
        (container.querySelector('.ql-video') as HTMLVideoElement).src,
      ).toContain('http://player.vimeo.com/video/47762693/');
    });

    test('converts www.vimeo video url to embedded', () => {
      const { container, tooltip } = setup();
      insertVideo(tooltip, 'http://www.vimeo.com/47762693');
      expect(
        (container.querySelector('.ql-video') as HTMLVideoElement).src,
      ).toContain('http://player.vimeo.com/video/47762693/');
    });

    test('preserves vimeo video url protocol', () => {
      const { container, tooltip } = setup();
      insertVideo(tooltip, 'https://www.vimeo.com/47762693');
      expect(
        (container.querySelector('.ql-video') as HTMLVideoElement).src,
      ).toContain('https://player.vimeo.com/video/47762693/');
    });

    test('uses https as default vimeo video url protocol', () => {
      const { container, tooltip } = setup();
      insertVideo(tooltip, 'vimeo.com/47762693');
      expect(
        (container.querySelector('.ql-video') as HTMLVideoElement).src,
      ).toContain('https://player.vimeo.com/video/47762693/');
    });
  });
});
