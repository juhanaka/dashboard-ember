JQ = Ember.Namespace.create();

// Create a new mixin for jQuery UI widgets using the Ember
// mixin syntax.
JQ.Widget = Em.Mixin.create({
    // When Ember creates the view's DOM element, it will call this
    // method.
    didInsertElement: function () {
        "use strict";
        // Make jQuery UI options available as Ember properties
        var options = this._gatherOptions(), ui;

        // Make sure that jQuery UI events trigger methods on this view.
        this._gatherEvents(options);

        // Create a new instance of the jQuery UI widget based on its `uiType`
        // and the current element.
        if (typeof jQuery.ui[this.get('uiType')] === 'function') {
            ui = jQuery.ui[this.get('uiType')](options, this.get('element'));
        } else {
            ui = $(this.get('element'))[this.get('uiType')](options);
        }
        
        // Save off the instance of the jQuery UI widget as the `ui` property
        // on this Ember view.
        this.set('ui', ui);
    },

    // When Ember tears down the view's DOM element, it will call
    // this method.
    willDestroyElement: function () {
        "use strict";
        var ui = this.get('ui'), observers, prop;

        if (ui) {
            // Tear down any observers that were created to make jQuery UI
            // options available as Ember properties.
            observers = this._observers;
            for (prop in observers) {
                if (observers.hasOwnProperty(prop)) {
                    this.removeObserver(prop, observers[prop]);
                }
            }
            ui._destroy();
        }
    },

    // Each jQuery UI widget has a series of options that can be configured.
    // For instance, to disable a button, you call
    // `button.options('disabled', true)` in jQuery UI. To make this compatible
    // with Ember bindings, any time the Ember property for a
    // given jQuery UI option changes, we update the jQuery UI widget.
    _gatherOptions: function () {
        "use strict";
        var uiOptions = this.get('uiOptions'), options = {};

        // The view can specify a list of jQuery UI options that should be treated
        // as Ember properties.
        uiOptions.forEach(function (key) {
            options[key] = this.get(key);

            // Set up an observer on the Ember property. When it changes,
            // call jQuery UI's `setOption` method to reflect the property onto
            // the jQuery UI widget.
            var observer = function () {
                var value = this.get(key);
                this.get('ui')._setOption(key, value);
            };

            this.addObserver(key, observer);

            // Insert the observer in a Hash so we can remove it later.
            this._observers = this._observers || {};
            this._observers[key] = observer;
        }, this);

        return options;
    },

    // Each jQuery UI widget has a number of custom events that they can
    // trigger. For instance, the progressbar widget triggers a `complete`
    // event when the progress bar finishes. Make these events behave like
    // normal Ember events. For instance, a subclass of JQ.ProgressBar
    // could implement the `complete` method to be notified when the jQuery
    // UI widget triggered the event.
    _gatherEvents: function (options) {
        "use strict";
        var uiEvents = this.get('uiEvents') || [], self = this;

        uiEvents.forEach(function (event) {
            var callback = self[event];

            if (callback) {
                // You can register a handler for a jQuery UI event by passing
                // it in along with the creation options. Update the options hash
                // to include any event callbacks.
                options[event] = function (event, ui) { callback.call(self, event, ui); };
            }
        });
    }
});

JQ.slider = Ember.View.extend(JQ.Widget, {
    uiType: 'slider',
    uiOptions: ['animate', 'disabled', 'max', 'min', 'orientation', 'range', 'step', 'value', 'values'],
    uiEvents: ['change', 'create', 'slide', 'start', 'stop'],
    tagName: 'div',

});