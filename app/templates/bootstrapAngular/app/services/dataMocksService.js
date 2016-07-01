(function () {
    //var urlConfig=angular.module("mapApp").constant("urlConfig");
    var mocks=angular.module("e2eMocks", ["ngMockE2E"]);

    mocks.run(function($httpBackend) {
        var baseUrl = UrlConfig.baseUrl,
        modelUrl = UrlConfig.modelUrl,
        
        checkForChanges = UrlConfig.checkForChanges;
        var model=[    
        {
            type:"build",
            id:"123456",
            owner:"peter",
            time:new Date(),
            state:"pending",
            metrics:{ state:"pending",
                    test:{
                        state:"up",
                        value:64
                    },
                    mantainability:{
                        state:"up",
                        value:53
                    },
                    security:{
                        state:"right",
                        value:64
                    },
                    workmanship:{
                        state:"down",
                        value:72
                    }
                },
            build:{ state:"pending",
                  time:new Date()},
            unitTest:{ state:"pending",
                           testData:[{
                            value: 62,
                            color:"#E88335",
                            highlight: "#FF5A5E",
                            label: "Test Pending"
                            },
                            {
                            value: 96,
                            color: "#70B042",
                            highlight: "#5AD3D1",
                            label: "Test Passed"
                            }],
                            codeCovered:11
                        },
            functionalTest:{ state:"pending",
                           testData:[{
                            value: 142,
                            color:"#E88335",
                            highlight: "#FF5A5E",
                            label: "Test Pending"
                            },
                            {
                            value: 10,
                            color: "#70B042",
                            highlight: "#5AD3D1",
                            label: "Test Passed"
                            }],
                            codeCovered:76
                        },
            result:{
                status:"pending",
                deployTo:["Production","Test"]
            }
        },
        {
            type:"firewall",
            id:"123456",
            owner:"peter",
            time:new Date(),
            state:"running",
            metrics:{ state:"pending",
                    test:{
                        state:"up",
                        value:64
                    },
                    mantainability:{
                        state:"up",
                        value:53
                    },
                    security:{
                        state:"right",
                        value:64
                    },
                    workmanship:{
                        state:"down",
                        value:72
                    }
                },
            build:{ state:"rejected",
                  time:new Date()},
            unitTest:{ state:"complete",
                           testData:[{
                            value: 192,
                            color:"#E88335",
                            highlight: "#FF5A5E",
                            label: "Test Pending"
                            },
                            {
                            value: 15,
                            color: "#70B042",
                            highlight: "#5AD3D1",
                            label: "Test Passed"
                            }],
                            codeCovered:22
                        },
            functionalTest:{ state:"complete",
                           testData:[{
                            value: 22,
                            color:"#E88335",
                            highlight: "#FF5A5E",
                            label: "Test Pending"
                            },
                            {
                            value: 11,
                            color: "#70B042",
                            highlight: "#5AD3D1",
                            label: "Test Passed"
                            }],
                            codeCovered:88
                        },
            result:{
                status: "rejected",
                message:"Metrics Reduction"
            }
        },
        {
            type:"build",
            id:"123456",
            owner:"peter",
            time:new Date(),
            state:"rejected",
            metrics:{ state:"pending",
                    test:{
                        state:"up",
                        value:64
                    },
                    mantainability:{
                        state:"up",
                        value:53
                    },
                    security:{
                        state:"right",
                        value:64
                    },
                    workmanship:{
                        state:"down",
                        value:72
                    }
                },
            build:{ state:"rejected",
                  time:new Date()},
            unitTest:{ state:"complete",
                           testData:[{
                            value: 33,
                            color:"#E88335",
                            highlight: "#FF5A5E",
                            label: "Test Pending"
                            },
                            {
                            value: 66,
                            color: "#70B042",
                            highlight: "#5AD3D1",
                            label: "Test Passed"
                            }],
                            codeCovered:22
                        },
            functionalTest:{ state:"complete",
                           testData:[{
                            value: 600,
                            color:"#E88335",
                            highlight: "#FF5A5E",
                            label: "Test Pending"
                            },
                            {
                            value: 10,
                            color: "#70B042",
                            highlight: "#5AD3D1",
                            label: "Test Passed"
                            }],
                            codeCovered:99
                        },
            result:{
                status: "rejected",
                deployTo:["Production","Test"]
            }
        },
        {
            type:"firewall",
            id:"123456",
            owner:"peter",
            time:new Date(),
            state:"complete",
            metrics:{ state:"pending",
                    test:{
                        state:"up",
                        value:64
                    },
                    mantainability:{
                        state:"up",
                        value:53
                    },
                    security:{
                        state:"right",
                        value:64
                    },
                    workmanship:{
                        state:"down",
                        value:72
                    }
                },
            build:{ state:"rejected",
                  time:new Date()},
            unitTest:{ state:"complete",
                           testData:[{
                            value: 33,
                            color:"#E88335",
                            highlight: "#FF5A5E",
                            label: "Test Pending"
                            },
                            {
                            value: 19,
                            color: "#70B042",
                            highlight: "#5AD3D1",
                            label: "Test Passed"
                            }],
                            codeCovered:20
                        },
            functionalTest:{ state:"complete",
                           testData:[{
                            value: 13,
                            color:"#E88335",
                            highlight: "#FF5A5E",
                            label: "Test Pending"
                            },
                            {
                            value: 66,
                            color: "#70B042",
                            highlight: "#5AD3D1",
                            label: "Test Passed"
                            }],
                            codeCovered:26
                        },
            result:{
                status: "accepted",
                message:"Auto-Merged"
            }
        }];
        $httpBackend.whenGET(baseUrl + modelUrl).respond(model);

        // Don"t mock the html views
        $httpBackend.whenGET(/views\/\w+.*/).passThrough();

        // For everything else, don"t mock
        $httpBackend.whenGET(/^\w+.*/).passThrough();
        $httpBackend.whenPOST(/^\w+.*/).passThrough();
    });
    
    angular.module("mapApp").requires.push("e2eMocks");
    
    //var MockService = function ($scope, $location, $filter, dataService, modalService) {
    
}())