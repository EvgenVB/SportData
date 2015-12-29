window.SportData.views.RemoveRandomEventsData = Backbone.View.extend({
    percentageField: null,
    removeBtn: null,
    infoLayout: null,
    events: {
        'keyup .remove-percentage': 'toggleActionButtonDisabling',
        'click .remove-event-rows-btn': 'removeEventRows'
    },
    initialize: function(options) {
        this.percentageField = this.$el.find('.remove-percentage');
        this.removeBtn = this.$el.find('.remove-event-rows-btn');
        this.infoLayout = this.$el.find('.remove-action-info');
        this.toggleActionButtonDisabling();
    },
    toggleActionButtonDisabling: function() {
        var value = this.percentageField.val().trim();
        if (value !== ''
            && !isNaN(Number(value))
        && Number(value) > 0
        && Number(value) <= 100) {
            this.removeBtn.prop('disabled', false);
        } else {
            this.removeBtn.prop('disabled', true);
        }
    },
    removeEventRows: function() {
        var value = this.percentageField.val().trim();
        var scope = this;
        this.disableControls();
        $.ajax('/sport-events/remove-random-data', {
            data: {percentage: Number(value)},
            complete: function() {
                scope.enableControls();
            },
            success: function(data){
                scope.showInfo(data.deleted);
            },
            error: function(data) {
                scope.showError(data);
            }
        })
    },
    showInfo: function(deletedCount) {
        this.infoLayout.html('<span class="label label-success">Deleted '+deletedCount+' rows</span>');
    },
    showError: function(message) {
        this.infoLayout.html('<span class="label label-danger">Error: '+message+'</span>');
    },
    disableControls: function() {
        this.infoLayout.html('<span class="label label-warning">processing...</span>');
        this.removeBtn.prop('disabled', true);
        this.percentageField.prop('disabled', true);
    },
    enableControls: function() {
        this.removeBtn.prop('disabled', false);
        this.percentageField.prop('disabled', false);
    }
});