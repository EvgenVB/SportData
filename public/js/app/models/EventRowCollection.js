window.SportData.models.EventRowCollection = Backbone.Collection.extend({
    count: 0,
    model: SportData.models.EventRow,
    url: '/sport-events',
    parse: function(response) {
        this.rowsCount = response.count;
        this.rawData = response.data;
        return this.rawData;
    }
});