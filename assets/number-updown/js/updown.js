/* ================================================
 * Increase/decrease number for Input field by using arrow up/down keys.
 * 
 * Useful when it's not possible to use HTML5's Number.
 * 
 * No modern version of jQuery UI is required.
 * 
 * Licensed under The MIT License.
 * ================================================ */

!function($) {
    "use strict";

    var Updown = function($element, options) {
        this.defaultOptions = {
            step: 1,
            shiftStep: 6,
            circle: false,
            min: null,
            max: null
        };
        this.init($element, options);
    };

    Updown.prototype = {
        constructor: Updown,
        init: function($element, options) {
            this.$element = $element;
            this.options = $.extend(true, this.defaultOptions, options);
            this.watchKeyboard();
            this.watchMouse();
            
            return this;
        },
        watchKeyboard: function() {
            var self = this;
            this.$element.bind('keydown', function(event) {
                var code = (event.keyCode ? event.keyCode : event.which);
                if (self.keysMap[code] && !isNaN(self.getInputVal())) {
                    self.keysMap[code].call(self, event);
                    event.preventDefault();
                }
            });

            return this;
        },
        watchMouse: function() {
            var self = this;
            this.$element.bind('mousewheel DOMMouseScroll', function(event) {
                var e = window.event || event; // old IE support
                var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail || -e.originalEvent.detail)));
                if (delta < 0) {
                    self.keysMap[40].call(self, event);
                } else {
                    self.keysMap[38].call(self, event);
                }
                event.preventDefault();
            });

            return this;
        },
        keysMap: {
            38: function(event) {
                this.increase(event);
                this.triggerEvents();

                return this;
            },
            40: function(event) {
                this.decrease(event);
                this.triggerEvents();

                return this;
            }
        },
        getNumberVal: function(val) {
            if (!val) {
                return 0;
            }

            return Number(val);
        },
        getInputVal: function() {
            return this.getNumberVal(this.$element.val());
        },
        setInputVal: function(val) {
            this.$element.val(val);

            return this;
        },
        increase: function(event) {
            var step = event.shiftKey ? this.options.shiftStep : this.options.step;
            var val = this.getInputVal() + step;
            if (this.options.max !== null && val > this.options.max) {
                val = this.options.circle ? this.options.min : this.options.max;
            }
            this.setInputVal(val);

            return this;
        },
        decrease: function(event) {
            var step = event.shiftKey ? this.options.shiftStep : this.options.step;
            var val = this.getInputVal() - step;
            if (this.options.min !== null && val < this.options.min) {
                val = this.options.circle ? this.options.max : this.options.min;
            }
            this.setInputVal(val);

            return this;
        },
        triggerEvents: function() {
            this.$element.trigger('keyup');

            return this;
        }
    };

    $.fn.updown = function(options) {
        return this.each(function(index) {
            var $this = $(this);
            var data = $this.data('updown');
            if (!data) {
                $this.data('updown', new Updown($(this), options));
            }
        });
    };
}(window.jQuery);