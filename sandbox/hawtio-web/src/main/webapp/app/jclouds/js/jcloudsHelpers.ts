/**
 * @module Jclouds
 */
module Jclouds {

    Array.prototype.unique = function() {
        var a = [], l = this.length;
        for(var i=0; i<l; i++) {
            for(var j=i+1; j<l; j++)
                if (this[i] === this[j]) j = ++i;
            a.push(this[i]);
        }
        return a;
    };

    export function setSelect(selection, group) {
        if (!angular.isDefined(selection)) {
            return group[0];
        }
        var answer = group.findIndex(function (item) {
            return item === selection
        });
        if (answer !== -1) {
            return group[answer];
        } else {
            return group[0];
        }
    }

    /**
     * Returns context by name.
     * @method fundContextByName
     * @for Jclouds
     * @param {Workspace} workspace
     * @param {String} name
     * @return {any}
     */
    export function findContextByName(workspace, name) {
        var jcloudsMBean = getSelectionJcloudsMBean(workspace)
        var response = workspace.jolokia.request({type: 'read', mbean: jcloudsMBean});
        return response.value["Contexts"].find(function (context) {
            return context.name === name
        });
    }

    /**
     * Add the type attribute to an array of apis
     * @method populateTypeForApis
     * @for Jclouds
     * @param {Array} apis
     */
    export function populateTypeForApis(apis) {
        angular.forEach(apis, (api) => {
            populateTypeForApi(api)
        });
    }

    /**
     * Add the type attribute to a singe api.
     * @method populateTypeForApi
     * @for Jclouds
     * @param {any} api
     */
    export function populateTypeForApi(api) {
        var views = api["views"];
        var found = false;
        angular.forEach(views, (view) => {
            if (!found) {
                if (view.has("blob")) {
                    api["type"] = "blobstore";
                    found = true;
                } else if (view.has("compute")) {
                    api["type"] = "compute";
                    found = true;
                }
            }
        });
    }

    /**
     * Filters Images based on Operating System.
     * @method filterImages
     * @for Jclouds
     * @param {Array} images
     * @param {any} operatingSystemFamily
     */
    export function filterImages(images, operatingSystemFamily) {
        if (operatingSystemFamily === "") {
            return images;
        } else {
            return images.findAll(function (image) {
                return image["operatingSystem"]["family"] === operatingSystemFamily
            });
        }
    }

    /**
     * Filters Nodes based on type.
     * @method filterNodes
     * @for Jclouds
     * @param {Array} nodes
     * @param {String} group
     * @param {String} location}
     * @return {any}
     */
    export function filterNodes(nodes, group, location) {
        var filteredNodes = [];
        if (group === "") {
            filteredNodes = nodes;
        } else {
            filteredNodes = nodes.findAll(function (node) {
                return node.group === group
            });
        }

        if (location === "") {
            return filteredNodes;
        } else {
            return filteredNodes.findAll(function (node) {
                return node.locationId === location
            });
        }
    }

    export function resumeNode(workspace, jolokia, compute, id, success, error) {
        jolokia.request(
            {
                type: 'exec', mbean: getSelectionJcloudsComputeMBean(workspace, compute),
                operation: 'resumeNode(java.lang.String)',
                arguments: [id]
            },
            onSuccess(success, { error: error }));
    }

    export function suspendNode(workspace, jolokia, compute, id, success, error) {
        jolokia.request(
            {
                type: 'exec', mbean: getSelectionJcloudsComputeMBean(workspace, compute),
                operation: 'suspendNode(java.lang.String)',
                arguments: [id]
            },
            onSuccess(success, { error: error }));
    }

    export function rebootNode(workspace, jolokia, compute, id, success, error) {
        jolokia.request(
            {
                type: 'exec', mbean: getSelectionJcloudsComputeMBean(workspace, compute),
                operation: 'rebootNode(java.lang.String)',
                arguments: [id]
            },
            onSuccess(success, { error: error }));
    }

    export function destroyNode(workspace, jolokia, compute, id, success, error) {
        jolokia.request(
            {
                type: 'exec', mbean: getSelectionJcloudsComputeMBean(workspace, compute),
                operation: 'destroyNode(java.lang.String)',
                arguments: [id]
            },
            onSuccess(success, { error: error }));
    }

    /**
     * Filters Apis based on type.
     * @method apisOfType
     * @for Jclouds
     * @param {Array} apis
     * @param {String} type
     * @return {Array}
     */
    export function apisOfType(apis, type) {
        if (type === "") {
            return apis;
        }

        return apis.findAll(function (api) {
            return api.type === type
        });
    }


    /**
     * Add the type attribute to an array of providers.
     * @method populateTypeForProviders
     * @for Jclouds
     * @param {Array} providers
     */
    export function populateTypeForProviders(providers) {
        angular.forEach(providers, (provider) => {
            populateTypeForProvider(provider)
        });
    }

    /**
     * Add the type attribute to a singe provider.
     * @method populateTypeForProvider
     * @for Jclouds
     * @param {any} provider
     */
    export function populateTypeForProvider(provider) {
        var views = provider["api"]["views"];
        var found = false;
        angular.forEach(views, (view) => {
            if (!found) {
                if (view.has("blob")) {
                    provider["type"] = "blobstore";
                    found = true;
                } else if (view.has("compute")) {
                    provider["type"] = "compute";
                    found = true;
                }
            }
        });
    }

    /**
     * Filters Providers based on type.
     * @method providersOfType
     * @for Jclouds
     * @param {Array} providers
     * @param {String} type
     * @return {Array}
     */
    export function providersOfType(providers, type) {
        if (type === "") {
            return providers;
        }

        return providers.findAll(function (provider) {
            return provider.type === type
        });
    }



    /**
     * Walks the tree looking in the first child all the way down until we find an objectName
     * @method findFirstObjectName
     * @for Jclouds
     * @param {any} node
     * @return {any}
     */
    export function findFirstObjectName(node) {
        if (node) {
            var answer = node.objectName;
            if (answer) {
                return answer;
            } else {
                var children = node.children;
                if (children && children.length) {
                    return findFirstObjectName(children[0]);
                }
            }
        }
        return null;
    }

    /**
     * Walks the tree looking for all available names.
     * @method childsOfType
     * @for Jclouds
     * @param {any} node
     * @return {Array}
     */
    export function childsOfType(node) {
        var types = [];
        angular.forEach(node.children, (child) => {
            types.push(child.title)
        });

        return types;
    }

    /**
     * Jclouds MBeans are all listed under org.jclouds <type> <name>.
     * This method lists all <names> for the specified <type>.
     * @method listJcloudsMBeanNameOfType
     * @for Jclouds
     * @param {Workspace} workspace
     * @param {String} type
     * @return {any}
     */
    export function listJcloudsMBeanNameOfType(workspace:Workspace, type) {
        if (workspace) {
            // lets navigate to the tree item based on paths
            var folder = workspace.tree.navigate("org.jclouds", type);
            return childsOfType(folder);
        }
        return null;
    }

    /**
     * Returns the Jclouds Core Management MBean
     * @method getSelectionJcloudsMBean
     * @for Jclouds
     * @param {Workspace} workspace
     * @return {String}
     */
    export function getSelectionJcloudsMBean(workspace:Workspace):string {
        if (workspace) {
            // lets navigate to the tree item based on paths
            var folder = workspace.tree.navigate("org.jclouds", "management", "core");
            return findFirstObjectName(folder);
        }
        return null;
    }


    /**
     * Returns the Jclouds Compute Management MBean for the specified name.
     * @method getSelectionJcloudsComputeMBean
     * @for Jclouds
     * @param {Workspace} workspace
     * @param {String} name
     * @return {String}
     */
    export function getSelectionJcloudsComputeMBean(workspace:Workspace, name):string {
        if (workspace) {
            // lets navigate to the tree item based on paths
            var folder = workspace.tree.navigate("org.jclouds", "compute", name);
            return findFirstObjectName(folder);
        }
        return null;
    }

    /**
     * Returns the Jclouds Compute Management MBean for the specified name.
     * @method getSelectionJcloudsBlobstoreMBean
     * @for Jclouds
     * @param {Workspace} workspace
     * @param {String} name
     * @return {String}
     */
    export function getSelectionJcloudsBlobstoreMBean(workspace:Workspace, name):string {
        if (workspace) {
            // lets navigate to the tree item based on paths
            var folder = workspace.tree.navigate("org.jclouds", "blobstore", name);
            return findFirstObjectName(folder);
        }
        return null;
    }
}
