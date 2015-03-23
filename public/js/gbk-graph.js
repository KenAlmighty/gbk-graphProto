/**
 * Created by Kenneth on 15-03-19.
 */

$(function() {

    $('#cy').cytoscape({

        container: document.getElementById('cy'),
        ready: function () {

            console.log('ready')
            cy.add([
                {
                    group:"nodes",
                    id:"0",
                    name:""
                },
                {
                    group:"nodes",
                    id:"1",
                    name:""
                },
                {
                    group:"nodes",
                    id:"2",
                    name:""
                },
                {
                    group:"nodes",
                    id:"3",
                    name:""
                },
                {
                    group:"nodes",
                    id:"4",
                    name:""
                },
                {
                    group:"edges",
                    source:"0",
                    target:"1"
                },
                {
                    group:"edges",
                    source:"1",
                    target:"2"
                },
                {
                    group:"edges",
                    source:"0",
                    target:"3"
                },
                {
                    group:"edges",
                    source:"2",
                    target:"4"
                }
            ]);

            // Action Definitions //

            cy.on('tap', 'node', function ( event ) {

                // Find the relationship between the current node and the upcoming queries.
                var targetNode = event.cyTarget;
                var nodeID = targetNode.id();

                // Query then display results in console
                var hitData = [];
                hitData = nextLevelData({id: nodeID});
                console.log( hitData );

                // Add the results to the graph, parented by the tapped node
                cy.add( hitData );

            });

        },

        // configuration options
        elements:{
            nodes:[],
            edges:[]
        },

        /*
        elements: {
            nodes: [{
                group: "nodes",
                id: "0",
                name: "F"
            },
                {
                    group: "nodes",
                    id: "1",
                    name: "U"
                },
                {
                    group: "nodes",
                    id: "2",
                    name: "B"
                },
                {
                    group: "nodes",
                    id: "3",
                    name: "A"
                },
                {
                    group: "nodes",
                    id: "4",
                    name: "R"
                }],
            edges: [{
                group: "edges",
                source: "0",
                target: "1"
            },
                {
                    group: "edges",
                    source: "1",
                    target: "2"
                },
                {
                    group: "edges",
                    source: "0",
                    target: "3"
                },
                {
                    group: "edges",
                    source: "2",
                    target: "4"
                }]
        },
        */

        style: cytoscape.stylesheet()
            .selector('node')
            .css({
                'content': 'data(name)',
                'text-valign': 'center',
                'color': 'white',
                'text-outline-width': 2,
                'text-outline-color': '#888'
            })
            .selector('edge')
            .css({
                'target-arrow-shape': 'triangle'
            })
            .selector(':selected')
            .css({
                'background-color': 'black',
                'line-color': 'black',
                'target-arrow-color': 'black',
                'source-arrow-color': 'black'
            })
            .selector('.faded')
            .css({
                'opacity': 0.25,
                'text-opacity': 0
            }),

        layout: {name: 'dagre'},

        zoom: 1,
        pan: {x: 0, y: 0},

        // interaction options
        // most of these are just the defaults that we don't have to explicitly expose
        minZoom: 1e-50,
        maxZoom: 1e50,
        zoomingEnabled: true,
        userZoomingEnabled: true,
        panningEnabled: true,
        userPanningEnabled: true,
        boxSelectionEnabled: false,
        selectionType: (isTouchDevice ? 'additive' : 'single'),
        touchTapThreshold: 8,
        desktopTapThreshold: 4,
        autolock: false,
        autoungrabify: false,
        autounselectify: false,

        // rendering options
        headless: false,
        styleEnabled: true,
        hideEdgesOnViewport: false,
        hideLabelsOnViewport: false,
        textureOnViewport: false,
        motionBlur: false,
        wheelSensitivity: 1,
        pixelRatio: 1
        // leaving these alone to let the function be set the default
        // initrender: function(evt){},
        // renderer: {}

    });

    // Session Controls
    var sessionControls = {

        /* APPLICATION PARAMETRES:
         * expansion count - how many maximum nodes per level
         * Weight cutoff - lowest weight per expansion
         */

        // TODO: Might have to consider parameter adjustments per relation; I don't know if there's variance between score types and relation types.
        // This is essentially a topological view of the data that I would want to take to see what settings should be made available to the user.

        exCount: '',
        weightCut: '',
        dataSource: '',
        loadSession: function () {
            // Try for finding a session object to load
            // If yes, then load and return

            // If none, set defaults
            $.getJSON("defaults.json", function (data) {
                $.each(data, function (key, val) {

                    if (key === "nEX") {
                        sessionControls.nEx = val;
                    }
                    ;

                    if (key === "weightCut") {
                        sessionControls.weightCut = val;
                    }
                    ;

                });
            });

        }

    };
    sesh = session = sessionControls;

    /* nextLevelData:
     * Gives data related to the tapped node that exists on the next level of analysis
     * Affected by the previous node's identification data. This directs the query.
     */
    function nextLevelData(searchParams) {

        // Argument Object takes sessionControls' values as default.
        // TODO If no ID given, then return 0. Is this the wisest way to handle error cases?
        searchParams = searchParams || {};
        searchParams.id = searchParams.id || 0;
        searchParams.exCount = searchParams.exCount || sesh.exCount;
        searchParams.weightCut = searchParams.weightCut || sesh.weightCut;
        searchParams.callback = searchParams.callback || function () {
        };

        // TODO: Ajax call here
        // TODO: Will use $.ajax for now to stay upwind of potential config problems later on.

        $.ajax({
            dataType: "json",
            url: sesh.dataSource,
            data: {
                // TODO: Insert request based on the argument information

            },
            success: function (returned_concepts) {

                returned_concepts = rc;
                console.log(" Query success - call returned");

                // process the returned data to map to cytoscape conventions
                // take concepts and assign to node groups
                // take relations and assign to edge groups
                // Concepts are linked by ID in the parser (by default?).
                return rc;

            }
        });

    };

});