window.SportData.views.UploadImportData = Backbone.View.extend({
    bar: null,
    btn: null,
    clickable: null,
    uploader: null,
    initialize: function(options) {
        this.uploader = new Dropzone(this.el, {
            url: "/import/sport-events-data",
            clickable: ".fileinput-button",
            uploadMultiple: false,
            //sad but be true
            previewTemplate: '<div style="display:none"></div>',
            createImageThumbnails: false
        });
        this.clickable = $(this.uploader.hiddenFileInput);
        this.model.on('change', this.updateProgress, this);
        this.bar = this.$el.find('.import-progress');
        this.btn = this.$el.find('.fileinput-button');
    },
    updateProgress: function() {
        var statistic = this.model.get('statistic');
        this.bar.removeClass('alert-info alert-danger alert-success alert-warning');
        switch (this.model.get('state')) {
        case 'PROGRESS':
            this.btn.attr('disabled','disabled');
            this.clickable = $(this.uploader.hiddenFileInput);
            this.clickable.prop("disabled",true);
            this.bar.addClass('alert-warning');
            this.bar.html('Importing. Processed '+statistic.doneCount+' rows, '+statistic.insertedCount+' rows inserted.');
            break;
        case 'DONE':
            this.btn.removeAttr('disabled');
            this.clickable.prop("disabled",false);
            this.bar.addClass('alert-success');
            this.bar.html('Done. Processed '+statistic.doneCount+' rows, '+statistic.insertedCount+' rows inserted.');
            break;
        case 'ERROR':
            this.btn.removeAttr('disabled');
            this.clickable.prop("disabled",false);
            this.bar.addClass('alert-danger');
            this.bar.html('Error. ' + this.model.get('message'));
            break;
        case 'NONE':
            this.btn.removeAttr('disabled');
            this.clickable.prop("disabled",false);
            this.bar.addClass('alert-info');
            this.bar.html('click button or drop file on it to start import');
        }
    }
});