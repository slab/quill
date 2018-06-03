import Quill from '../../../../core';
import { BaseTooltip } from '../../../../themes/base';

class Tooltip extends BaseTooltip {}

Tooltip.TEMPLATE = '<input type="text">';

describe('BaseTooltip', function() {
  describe('save', function() {
    beforeEach(function() {
      this.quill = this.initialize(Quill, '');
      this.tooltip = new Tooltip(this.quill);
    });

    it('converts youtube video url to embedded', function() {
      insertVideo(this.tooltip, 'http://youtube.com/watch?v=QHH3iSeDBLo');
      expect(this.container.querySelector('.ql-video').src).toContain(
        'http://www.youtube.com/embed/QHH3iSeDBLo',
      );
    });

    it('converts www.youtube video url to embedded', function() {
      insertVideo(this.tooltip, 'http://www.youtube.com/watch?v=QHH3iSeDBLo');
      expect(this.container.querySelector('.ql-video').src).toContain(
        'http://www.youtube.com/embed/QHH3iSeDBLo',
      );
    });

    it('converts m.youtube video url to embedded', function() {
      insertVideo(this.tooltip, 'http://m.youtube.com/watch?v=QHH3iSeDBLo');
      expect(this.container.querySelector('.ql-video').src).toContain(
        'http://www.youtube.com/embed/QHH3iSeDBLo',
      );
    });

    it('preserves youtube video url protocol', function() {
      insertVideo(this.tooltip, 'https://m.youtube.com/watch?v=QHH3iSeDBLo');
      expect(this.container.querySelector('.ql-video').src).toContain(
        'https://www.youtube.com/embed/QHH3iSeDBLo',
      );
    });

    it('uses https as default youtube video url protocol', function() {
      insertVideo(this.tooltip, 'youtube.com/watch?v=QHH3iSeDBLo');
      expect(this.container.querySelector('.ql-video').src).toContain(
        'https://www.youtube.com/embed/QHH3iSeDBLo',
      );
    });

    it('converts vimeo video url to embedded', function() {
      insertVideo(this.tooltip, 'http://vimeo.com/47762693');
      expect(this.container.querySelector('.ql-video').src).toContain(
        'http://player.vimeo.com/video/47762693/',
      );
    });

    it('converts www.vimeo video url to embedded', function() {
      insertVideo(this.tooltip, 'http://www.vimeo.com/47762693');
      expect(this.container.querySelector('.ql-video').src).toContain(
        'http://player.vimeo.com/video/47762693/',
      );
    });

    it('preserves vimeo video url protocol', function() {
      insertVideo(this.tooltip, 'https://www.vimeo.com/47762693');
      expect(this.container.querySelector('.ql-video').src).toContain(
        'https://player.vimeo.com/video/47762693/',
      );
    });

    it('uses https as default vimeo video url protocol', function() {
      insertVideo(this.tooltip, 'vimeo.com/47762693');
      expect(this.container.querySelector('.ql-video').src).toContain(
        'https://player.vimeo.com/video/47762693/',
      );
    });

    function insertVideo(tooltip, url) {
      tooltip.textbox.value = url;
      tooltip.root.setAttribute('data-mode', 'video');
      tooltip.save();
    }
  });
});
