(function() {
    var Ext = window.Ext4 || window.Ext;

    Ext.define('Rally.apps.printcards.printstorycards.PrintStoryCardsApp', {
        extend: 'Rally.app.TimeboxScopedApp',
        alias: 'widget.printstorycards',
        requires: [
            'Rally.data.wsapi.Store',
            'Rally.apps.printcards.PrintCard',
            'Rally.app.plugin.Print'
        ],
        plugins: [{
            ptype: 'rallyappprinting'
        }],
        componentCls: 'printcards',
        scopeType: 'iteration',

        launch: function() {
            this.add({
                xtype: 'container',
                itemId: 'cards'
            });
            this.callParent(arguments);
        },

        onScopeChange: function(scope) {
            this.down('#cards').getEl().dom.innerHTML = '';
            this._loadStories(scope);
        },

        _loadStories: function(scope) {
            Ext.create('Rally.data.wsapi.Store', {
                autoLoad: true,
                model: Ext.identityFn('UserStory'),
                fetch: ['FormattedID', 'Name', 'Owner', 'Description', 'PlanEstimate'],
                limit: (scope.getRecord()) ? 200 : 50,
                listeners: {
                    load: this._onStoriesLoaded,
                    scope: this
                },
                filters: [
                    scope.getQueryFilter()
                ]
            });
        },

        _onStoriesLoaded: function(store, records) {
            var printCardHtml = '';
            _.each(records, function(record, idx) {
                printCardHtml += Ext.create('Rally.apps.printcards.PrintCard').tpl.apply(record.data);
                if (idx%4 === 3) {
                    printCardHtml += '<div class="pb"></div>';
                }
            }, this);
            Ext.DomHelper.insertHtml('beforeEnd', this.down('#cards').getEl().dom, printCardHtml);

            if(Rally.BrowserTest) {
                Rally.BrowserTest.publishComponentReady(this);
            }
        },

        getOptions: function() {
            return [
                this.getPrintMenuOption({title: 'Print Story Cards App'}) //from printable mixin
            ];
        }
    });
})();