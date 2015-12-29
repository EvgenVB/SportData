window.SportData.views.EventsGridView = Backbone.View.extend({
    paginator: null,
    lastCount:0,
    page: 1,
    gridTemplate: null,
    gridLayout: null,
    updateBtn: null,
    events: {
        'click .refresh-grid-btn': 'updateData'
    },
    initialize: function(options) {
        this.collection.on('sync', function() {
            this.onDataLoaded();
        },this);

        this.gridTemplate = _.template($('#events-grid-template').html());
        this.gridLayout = this.$el.find('.events-data-grid-layout');
        this.updateBtn = this.$el.find('.refresh-grid-btn');
        this.updateData();
    },
    onDataLoaded: function(){
        var scope = this, lastEventStamp = 0, pagesCount = Math.floor(this.collection.rowsCount/10)+1;

        if (!this.lastCount != this.collection.rowsCount) {

            if (!this.paginator) {
                this.paginator = this.$el.find('.paginator-layout')
                    .bootpag({
                        total: pagesCount,
                        page: 1,
                        maxVisible: 5,
                        leaps: true,
                        firstLastUse: true,
                        first: '←',
                        last: '→',
                        wrapClass: 'pagination',
                        activeClass: 'active',
                        disabledClass: 'disabled',
                        nextClass: 'next',
                        prevClass: 'prev',
                        lastClass: 'last',
                        firstClass: 'first'
                    })
                    .on("page", function(event, num){
                        if ((event.timeStamp - lastEventStamp) < 100) {
                            return;
                        }
                        lastEventStamp = event.timeStamp;
                        scope.page = num;
                        scope.updateData();
                    });
            } else {
                this.paginator.bootpag({total: pagesCount});
                if (pagesCount < this.page) {
                    this.page = pagesCount;
                    this.updateData();
                }
            }

        }
        this.gridLayout.html(this.gridTemplate({data: this.collection.rawData}));
        this.updateBtn.prop('disabled', false);
    },
    updateData: function() {
        this.updateBtn.prop('disabled', true);
        this.collection.fetch({data: {page: this.page}});
    }
});