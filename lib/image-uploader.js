(function($) {

  $.fn.imageUploader = function(opts) {

    opts = $.extend({}, $.fn.imageUploader.defaults, opts);

    return this.each(function() {
      var el = $(this);

      var showProgress = function() {
        el.html(opts.progressTemplate);
      };

      var showComplete = function(data) {
        var img = (opts.processData) ? opts.processData(data) : data;
        if (!img) {
          return;
        }
        el
          .html(opts.completeTemplate)
          .find('img')
            .attr('src', img);
      };

      el.css('cursor', 'pointer');

      var form = $('<form/>')
        .attr({
          action: opts.action,
          method: opts.method,
          enctype: 'multipart/form-data'
        })
        .appendTo('body');

      var input = $('<input/>')
        .attr({
          name: opts.postKey,
          type: 'file'
        })
        .css({
          opacity: '0',
          cursor: 'pointer',
          position: 'absolute',
          zIndex: opts.zIndex
        })
        .on('change', function(e) {
          var filename = e.target.value;
          var ext = filename.split('.').pop().toLowerCase();  
          if ($.inArray(ext, opts.allow) == -1) {
            alert('Please select a photo with a ' + opts.allow.join(', ') + ' extension');
            return;
          }

          el.trigger('fileSelect');
          showProgress();
          form.submit();
        })
        .appendTo(form);

      form
        .framejax()
        .on('complete', function(e, results) {
          showComplete(results);
          el.trigger('complete', results);
        });

      el.on('mousemove', function(e) {
        var h = input.height();
        var w = input.width();
        if (typeof e.pageY == 'undefined' && typeof e.clientX == 'number' && document.documentElement) {
          e.pageX = e.clientX + document.documentElement.scrollLeft;
          e.pageY = e.clientY + document.documentElement.scrollTop;
        }
        input.css({
          top: e.pageY - (h / 2),
          left: e.pageX - (w - 30)
        });
      });
    });

  };

  $.fn.imageUploader.defaults = {
    action: window.location.href,
    method: 'POST',
    postKey: 'image',
    progressTemplate: '<div class="progress">Uploading...</div>',
    completeTemplate: '<img/>',
    allow: ['jpg', 'png', 'bmp', 'gif', 'jpeg'],
    processData: null,
    zIndex: 2
  };

})(window.jQuery);
