document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    const app = new BossAI();
    app.init();
});

class BossAI {
    constructor() {
        this.nodes = [];
        this.connections = [];
        this.selectedNode = null;
        this.scale = 1;
        this.offset = { x: 0, y: 0 };
        this.dragging = false;
        this.dragStart = { x: 0, y: 0 };
        this.nodeTypes = this.getNodeTypes();
        this.currentWorkflow = {
            id: 'workflow-' + Date.now(),
            name: 'New Workflow',
            nodes: [],
            connections: []
        };
    }

    init() {
        this.initCanvas();
        this.initNodePanel();
        this.initEventListeners();
        this.loadSampleWorkflow();
    }

    initCanvas() {
        this.canvas = document.getElementById('workflow-canvas');
        this.canvasContainer = document.getElementById('workflow-canvas-container');
        
        // Make canvas draggable
        interact(this.canvasContainer)
            .draggable({
                listeners: {
                    start: (event) => {
                        this.dragging = true;
                        this.dragStart = {
                            x: event.clientX - this.offset.x,
                            y: event.clientY - this.offset.y
                        };
                    },
                    move: (event) => {
                        if (this.dragging) {
                            this.offset = {
                                x: event.clientX - this.dragStart.x,
                                y: event.clientY - this.dragStart.y
                            };
                            this.updateCanvasTransform();
                        }
                    },
                    end: () => {
                        this.dragging = false;
                    }
                }
            });
    }

    initNodePanel() {
        const accordion = document.getElementById('nodesAccordion');
        
        // Group nodes by category
        const categories = {};
        this.nodeTypes.forEach(nodeType => {
            if (!categories[nodeType.category]) {
                categories[nodeType.category] = [];
            }
            categories[nodeType.category].push(nodeType);
        });
        
        // Create accordion items for each category
        Object.keys(categories).forEach((category, index) => {
            const categoryId = `category-${index}`;
            const accordionItem = document.createElement('div');
            accordionItem.className = 'accordion-item';
            
            const accordionHeader = document.createElement('h2');
            accordionHeader.className = 'accordion-header';
            accordionHeader.id = `heading-${categoryId}`;
            
            const accordionButton = document.createElement('button');
            accordionButton.className = 'accordion-button collapsed';
            accordionButton.type = 'button';
            accordionButton.setAttribute('data-bs-toggle', 'collapse');
            accordionButton.setAttribute('data-bs-target', `#${categoryId}`);
            accordionButton.textContent = category;
            
            accordionHeader.appendChild(accordionButton);
            
            const accordionCollapse = document.createElement('div');
            accordionCollapse.id = categoryId;
            accordionCollapse.className = 'accordion-collapse collapse';
            accordionCollapse.setAttribute('aria-labelledby', `heading-${categoryId}`);
            accordionCollapse.setAttribute('data-bs-parent', '#nodesAccordion');
            
            const accordionBody = document.createElement('div');
            accordionBody.className = 'accordion-body p-2';
            
            categories[category].forEach(nodeType => {
                const nodeTypeElement = document.createElement('div');
                nodeTypeElement.className = 'node-type';
                nodeTypeElement.innerHTML = `
                    <i class="${nodeType.icon} node-type-icon"></i>
                    ${nodeType.name}
                `;
                nodeTypeElement.setAttribute('data-type', nodeType.type);
                nodeTypeElement.addEventListener('click', () => this.addNodeToCanvas(nodeType));
                accordionBody.appendChild(nodeTypeElement);
            });
            
            accordionCollapse.appendChild(accordionBody);
            accordionItem.appendChild(accordionHeader);
            accordionItem.appendChild(accordionCollapse);
            accordion.appendChild(accordionItem);
        });
        
        // Initialize node search
        document.getElementById('node-search').addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const nodeTypes = document.querySelectorAll('.node-type');
            
            nodeTypes.forEach(nodeType => {
                const nodeName = nodeType.textContent.toLowerCase();
                if (nodeName.includes(searchTerm)) {
                    nodeType.style.display = 'flex';
                } else {
                    nodeType.style.display = 'none';
                }
            });
        });
    }

    initEventListeners() {
        // Zoom buttons
        document.getElementById('zoom-in').addEventListener('click', () => this.zoom(0.1));
        document.getElementById('zoom-out').addEventListener('click', () => this.zoom(-0.1));
        document.getElementById('center-canvas').addEventListener('click', () => this.centerCanvas());
        
        // Save and execute buttons
        document.getElementById('save-btn').addEventListener('click', () => this.saveWorkflow());
        document.getElementById('execute-btn').addEventListener('click', () => this.executeWorkflow());
        
        // Toggle nodes panel
        document.getElementById('toggle-nodes').addEventListener('click', () => {
            const nodesPanel = document.getElementById('nodes-panel');
            const icon = document.querySelector('#toggle-nodes i');
            
            if (nodesPanel.style.display === 'none') {
                nodesPanel.style.display = 'block';
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            } else {
                nodesPanel.style.display = 'none';
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Delete' && this.selectedNode) {
                this.removeNode(this.selectedNode);
            }
        });
    }

    addNodeToCanvas(nodeType) {
        const nodeId = 'node-' + Date.now();
        const newNode = {
            id: nodeId,
            type: nodeType.type,
            name: nodeType.name,
            x: 100,
            y: 100,
            inputs: nodeType.inputs || 1,
            outputs: nodeType.outputs || 1,
            configuration: {}
        };
        
        // Create node element
        const nodeElement = document.createElement('div');
        nodeElement.className = `node node-${nodeType.category.toLowerCase()}`;
        nodeElement.id = nodeId;
        nodeElement.style.left = `${newNode.x}px`;
        nodeElement.style.top = `${newNode.y}px`;
        nodeElement.innerHTML = `
            <div class="node-header">
                <span>${nodeType.name}</span>
                <div class="node-actions">
                    <button class="btn btn-sm btn-outline-secondary configure-node" title="Configure">
                        <i class="fas fa-cog"></i>
                    </button>
                </div>
            </div>
            <div class="node-body">
                <small class="text-muted">${nodeType.description}</small>
            </div>
        `;
        
        // Add connectors
        for (let i = 0; i < newNode.inputs; i++) {
            const inputConnector = document.createElement('div');
            inputConnector.className = 'node-connector input';
            inputConnector.style.top = `${25 + i * 20}px`;
            inputConnector.setAttribute('data-connector-type', 'input');
            inputConnector.setAttribute('data-connector-index', i);
            nodeElement.appendChild(inputConnector);
        }
        
        for (let i = 0; i < newNode.outputs; i++) {
            const outputConnector = document.createElement('div');
            outputConnector.className = 'node-connector output';
            outputConnector.style.top = `${25 + i * 20}px`;
            outputConnector.setAttribute('data-connector-type', 'output');
            outputConnector.setAttribute('data-connector-index', i);
            nodeElement.appendChild(outputConnector);
        }
        
        this.canvas.appendChild(nodeElement);
        this.nodes.push(newNode);
        
        // Make node draggable
        this.makeNodeDraggable(nodeElement);
        
        // Add event listeners for node actions
        nodeElement.querySelector('.configure-node').addEventListener('click', (e) => {
            e.stopPropagation();
            this.configureNode(newNode);
        });
        
        // Add connector event listeners
        this.setupConnectorEvents(nodeElement, newNode);
        
        // Select the node
        this.selectNode(nodeElement, newNode);
    }

    makeNodeDraggable(nodeElement) {
        const nodeId = nodeElement.id;
        const node = this.nodes.find(n => n.id === nodeId);
        
        interact(nodeElement)
            .draggable({
                inertia: false,
                autoScroll: true,
                listeners: {
                    start: () => {
                        this.selectNode(nodeElement, node);
                    },
                    move: (event) => {
                        node.x += event.dx;
                        node.y += event.dy;
                        
                        nodeElement.style.left = `${node.x}px`;
                        nodeElement.style.top = `${node.y}px`;
                        
                        // Update connections
                        this.updateConnections(nodeId);
                    }
                }
            });
    }

    setupConnectorEvents(nodeElement, node) {
        const connectors = nodeElement.querySelectorAll('.node-connector');
        
        connectors.forEach(connector => {
            // Make connectors draggable for creating connections
            interact(connector)
                .draggable({
                    inertia: false,
                    autoScroll: true,
                    listeners: {
                        start: (event) => {
                            event.stopPropagation();
                            this.selectedConnector = {
                                nodeId: node.id,
                                type: connector.getAttribute('data-connector-type'),
                                index: parseInt(connector.getAttribute('data-connector-index'))
                            };
                            
                            // Create a temporary connection line
                            this.tempConnection = document.createElement('div');
                            this.tempConnection.className = 'node-connection';
                            this.canvas.appendChild(this.tempConnection);
                        },
                        move: (event) => {
                            if (!this.tempConnection) return;
                            
                            const startPos = this.getConnectorPosition(
                                this.selectedConnector.nodeId,
                                this.selectedConnector.type,
                                this.selectedConnector.index
                            );
                            
                            const endPos = {
                                x: event.clientX - this.canvasContainer.getBoundingClientRect().left + this.offset.x,
                                y: event.clientY - this.canvasContainer.getBoundingClientRect().top + this.offset.y
                            };
                            
                            this.drawConnection(this.tempConnection, startPos, endPos);
                        },
                        end: (event) => {
                            if (!this.tempConnection) return;
                            
                            // Find if we dropped on a connector
                            const elements = document.elementsFromPoint(event.clientX, event.clientY);
                            const targetConnector = elements.find(el => el.classList.contains('node-connector'));
                            
                            if (targetConnector && targetConnector !== connector) {
                                const targetNodeId = targetConnector.closest('.node').id;
                                const targetConnectorType = targetConnector.getAttribute('data-connector-type');
                                const targetConnectorIndex = parseInt(targetConnector.getAttribute('data-connector-index'));
                                
                                // Check if connection is valid (output to input)
                                if (this.selectedConnector.type !== targetConnectorType) {
                                    const sourceConnector = this.selectedConnector.type === 'output' ? this.selectedConnector : {
                                        nodeId: targetNodeId,
                                        type: targetConnectorType,
                                        index: targetConnectorIndex
                                    };
                                    
                                    const targetConnector = this.selectedConnector.type === 'input' ? this.selectedConnector : {
                                        nodeId: targetNodeId,
                                        type: targetConnectorType,
                                        index: targetConnectorIndex
                                    };
                                    
                                    this.createConnection(sourceConnector, targetConnector);
                                }
                            }
                            
                            // Remove temporary connection
                            if (this.tempConnection) {
                                this.tempConnection.remove();
                                this.tempConnection = null;
                            }
                            this.selectedConnector = null;
                        }
                    }
                });
            
            // Highlight connectors when hovering
            connector.addEventListener('mouseenter', () => {
                connector.style.transform = 'scale(1.2)';
                connector.style.background = '#4e73df';
            });
            
            connector.addEventListener('mouseleave', () => {
                connector.style.transform = 'scale(1)';
                connector.style.background = '#aaa';
            });
        });
    }

    createConnection(source, target) {
        // Check if connection already exists
        const existingConnection = this.connections.find(conn => 
            conn.source.nodeId === source.nodeId &&
            conn.source.index === source.index &&
            conn.target.nodeId === target.nodeId &&
            conn.target.index === target.index
        );
        
        if (existingConnection) return;
        
        const connectionId = 'conn-' + Date.now();
        const connection = {
            id: connectionId,
            source,
            target
        };
        
        this.connections.push(connection);
        
        // Draw the connection
        this.drawConnectionById(connectionId);
    }

    drawConnectionById(connectionId) {
        const connection = this.connections.find(conn => conn.id === connectionId);
        if (!connection) return;
        
        const sourcePos = this.getConnectorPosition(
            connection.source.nodeId,
            connection.source.type,
            connection.source.index
        );
        
        const targetPos = this.getConnectorPosition(
            connection.target.nodeId,
            connection.target.type,
            connection.target.index
        );
        
        let connectionElement = document.getElementById(connectionId);
        
        if (!connectionElement) {
            connectionElement = document.createElement('div');
            connectionElement.className = 'node-connection';
            connectionElement.id = connectionId;
            this.canvas.appendChild(connectionElement);
        }
        
        this.drawConnection(connectionElement, sourcePos, targetPos);
    }

    drawConnection(element, startPos, endPos) {
        // Calculate the path for the connection
        const dx = endPos.x - startPos.x;
        const dy = endPos.y - startPos.y;
        
        // Create a curved path
        const path = `M ${startPos.x} ${startPos.y} 
                     C ${startPos.x + dx * 0.5} ${startPos.y}, 
                       ${startPos.x + dx * 0.5} ${endPos.y}, 
                       ${endPos.x} ${endPos.y}`;
        
        element.innerHTML = `
            <svg width="100%" height="100%" style="position:absolute;top:0;left:0;">
                <path d="${path}" stroke="#4e73df" stroke-width="2" fill="none" />
            </svg>
        `;
    }

    getConnectorPosition(nodeId, connectorType, connectorIndex) {
        const nodeElement = document.getElementById(nodeId);
        if (!nodeElement) return { x: 0, y: 0 };
        
        const connector = nodeElement.querySelector(
            `.node-connector[data-connector-type="${connectorType}"][data-connector-index="${connectorIndex}"]`
        );
        
        if (!connector) return { x: 0, y: 0 };
        
        const nodeRect = nodeElement.getBoundingClientRect();
        const connectorRect = connector.getBoundingClientRect();
        const containerRect = this.canvasContainer.getBoundingClientRect();
        
        return {
            x: (connectorRect.left - containerRect.left + connectorRect.width / 2) - this.offset.x,
            y: (connectorRect.top - containerRect.top + connectorRect.height / 2) - this.offset.y
        };
    }

    updateConnections(nodeId) {
        this.connections
            .filter(conn => conn.source.nodeId === nodeId || conn.target.nodeId === nodeId)
            .forEach(conn => this.drawConnectionById(conn.id));
    }

    selectNode(nodeElement, node) {
        // Deselect current node
        if (this.selectedNode) {
            const prevNodeElement = document.getElementById(this.selectedNode.id);
            if (prevNodeElement) {
                prevNodeElement.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
            }
        }
        
        // Select new node
        this.selectedNode = node;
        nodeElement.style.boxShadow = '0 0 0 2px #4e73df';
    }

    removeNode(node) {
        if (!node) return;
        
        // Remove node element
        const nodeElement = document.getElementById(node.id);
        if (nodeElement) {
            nodeElement.remove();
        }
        
        // Remove associated connections
        this.connections = this.connections.filter(conn => 
            conn.source.nodeId !== node.id && conn.target.nodeId !== node.id
        );
        
        // Remove connection elements
        document.querySelectorAll('.node-connection').forEach(el => {
            const connectionId = el.id;
            if (!this.connections.some(conn => conn.id === connectionId)) {
                el.remove();
            }
        });
        
        // Remove from nodes array
        this.nodes = this.nodes.filter(n => n.id !== node.id);
        this.selectedNode = null;
    }

    configureNode(node) {
        const modal = new bootstrap.Modal(document.getElementById('nodeConfigModal'));
        const nodeType = this.nodeTypes.find(nt => nt.type === node.type);
        
        document.getElementById('nodeConfigModalTitle').textContent = `Configure ${nodeType.name}`;
        
        // Create configuration form based on node type
        let formHtml = `
            <div class="mb-3">
                <label class="form-label">Node Name</label>
                <input type="text" class="form-control" value="${node.name || nodeType.name}" id="node-name">
            </div>
        `;
        
        if (nodeType.configuration) {
            nodeType.configuration.forEach(config => {
                formHtml += `
                    <div class="mb-3">
                        <label class="form-label">${config.label}</label>
                        ${this.getConfigFieldHtml(config, node.configuration[config.name])}
                    </div>
                `;
            });
        }
        
        document.getElementById('nodeConfigModalBody').innerHTML = formHtml;
        modal.show();
        
        // Save configuration when save button is clicked
        document.getElementById('save-node-config').onclick = () => {
            node.name = document.getElementById('node-name').value;
            
            if (nodeType.configuration) {
                nodeType.configuration.forEach(config => {
                    const value = this.getConfigFieldValue(config);
                    node.configuration[config.name] = value;
                });
            }
            
            // Update node display
            const nodeElement = document.getElementById(node.id);
            if (nodeElement) {
                const header = nodeElement.querySelector('.node-header span');
                if (header) {
                    header.textContent = node.name;
                }
            }
            
            modal.hide();
        };
    }

    getConfigFieldHtml(config, currentValue) {
        switch (config.type) {
            case 'text':
                return `<input type="text" class="form-control" id="config-${config.name}" value="${currentValue || ''}">`;
            case 'number':
                return `<input type="number" class="form-control" id="config-${config.name}" value="${currentValue || 0}">`;
            case 'select':
                const options = config.options.map(opt => 
                    `<option value="${opt.value}" ${currentValue === opt.value ? 'selected' : ''}>${opt.label}</option>`
                ).join('');
                return `<select class="form-select" id="config-${config.name}">${options}</select>`;
            case 'checkbox':
                return `<input type="checkbox" class="form-check-input" id="config-${config.name}" ${currentValue ? 'checked' : ''}>`;
            case 'textarea':
                return `<textarea class="form-control" id="config-${config.name}" rows="3">${currentValue || ''}</textarea>`;
            default:
                return `<input type="text" class="form-control" id="config-${config.name}" value="${currentValue || ''}">`;
        }
    }

    getConfigFieldValue(config) {
        const element = document.getElementById(`config-${config.name}`);
        if (!element) return null;
        
        switch (config.type) {
            case 'text':
            case 'textarea':
                return element.value;
            case 'number':
                return parseFloat(element.value);
            case 'select':
                return element.value;
            case 'checkbox':
                return element.checked;
            default:
                return element.value;
        }
    }

    zoom(amount) {
        this.scale += amount;
        this.scale = Math.max(0.1, Math.min(3, this.scale)); // Limit zoom range
        
        document.getElementById('zoom-level').textContent = `${Math.round(this.scale * 100)}%`;
        this.updateCanvasTransform();
    }

    centerCanvas() {
        if (!this.canvasContainer) return;
        
        const containerWidth = this.canvasContainer.clientWidth;
        const containerHeight = this.canvasContainer.clientHeight;
        
        this.offset = {
            x: (containerWidth - 3000 * this.scale) / 2,
            y: (containerHeight - 3000 * this.scale) / 2
        };
        
        this.updateCanvasTransform();
    }

    updateCanvasTransform() {
        this.canvas.style.transform = `translate(${this.offset.x}px, ${this.offset.y}px) scale(${this.scale})`;
        
        // Update all connections
        this.connections.forEach(conn => this.drawConnectionById(conn.id));
    }

    saveWorkflow() {
        this.currentWorkflow.nodes = this.nodes;
        this.currentWorkflow.connections = this.connections;
        
        // In a real app, you would send this to a backend
        console.log('Saving workflow:', this.currentWorkflow);
        
        // For demo purposes, save to localStorage
        localStorage.setItem('currentWorkflow', JSON.stringify(this.currentWorkflow));
        
        alert('Workflow saved successfully!');
    }

    executeWorkflow() {
        console.log('Executing workflow...');
        
        // In a real app, you would send the workflow to a backend for execution
        // For demo purposes, we'll just simulate execution
        
        // Reset all node statuses
        this.nodes.forEach(node => {
            const nodeElement = document.getElementById(node.id);
            if (nodeElement) {
                const statusIndicator = nodeElement.querySelector('.execution-status');
                if (statusIndicator) {
                    statusIndicator.className = 'execution-status status-pending';
                }
            }
        });
        
        // Simulate execution with delays
        this.simulateExecution();
    }

    simulateExecution() {
        // Simple simulation that processes nodes in order
        let delay = 0;
        
        this.nodes.forEach((node, index) => {
            setTimeout(() => {
                const nodeElement = document.getElementById(node.id);
                if (!nodeElement) return;
                
                // Update status to running
                let statusIndicator = nodeElement.querySelector('.execution-status');
                if (!statusIndicator) {
                    statusIndicator = document.createElement('span');
                    statusIndicator.className = 'execution-status status-running';
                    nodeElement.querySelector('.node-header').prepend(statusIndicator);
                } else {
                    statusIndicator.className = 'execution-status status-running';
                }
                
                // Simulate processing time
                setTimeout(() => {
                    // Randomly choose success or error
                    const success = Math.random() > 0.2;
                    statusIndicator.className = `execution-status status-${success ? 'success' : 'error'}`;
                    
                    // If this is the last node, show completion message
                    if (index === this.nodes.length - 1) {
                        setTimeout(() => {
                            alert(`Workflow execution ${success ? 'completed successfully' : 'completed with errors'}`);
                        }, 500);
                    }
                }, 1000 + Math.random() * 1000);
            }, delay);
            
            delay += 500;
        });
    }

    loadSampleWorkflow() {
        // Try to load from localStorage
        const savedWorkflow = localStorage.getItem('currentWorkflow');
        if (savedWorkflow) {
            try {
                const workflow = JSON.parse(savedWorkflow);
                this.loadWorkflow(workflow);
                return;
            } catch (e) {
                console.error('Failed to parse saved workflow', e);
            }
        }
        
        // Load sample workflow
        const sampleWorkflow = {
            nodes: [
                {
                    id: 'node-1',
                    type: 'trigger',
                    name: 'Manual Trigger',
                    x: 200,
                    y: 200,
                    inputs: 0,
                    outputs: 1,
                    configuration: {}
                },
                {
                    id: 'node-2',
                    type: 'httpRequest',
                    name: 'Fetch Data',
                    x: 450,
                    y: 200,
                    inputs: 1,
                    outputs: 1,
                    configuration: {
                        url: 'https://api.example.com/data'
                    }
                },
                {
                    id: 'node-3',
                    type: 'function',
                    name: 'Process Data',
                    x: 700,
                    y: 200,
                    inputs: 1,
                    outputs: 1,
                    configuration: {
                        code: 'return input.map(item => ({ ...item, processed: true }));'
                    }
                }
            ],
            connections: [
                {
                    id: 'conn-1',
                    source: { nodeId: 'node-1', type: 'output', index: 0 },
                    target: { nodeId: 'node-2', type: 'input', index: 0 }
                },
                {
                    id: 'conn-2',
                    source: { nodeId: 'node-2', type: 'output', index: 0 },
                    target: { nodeId: 'node-3', type: 'input', index: 0 }
                }
            ]
        };
        
        this.loadWorkflow(sampleWorkflow);
    }

    loadWorkflow(workflow) {
        // Clear current workflow
        this.nodes = [];
        this.connections = [];
        this.canvas.innerHTML = '';
        
        // Set the new workflow
        this.currentWorkflow = workflow;
        
        // Create nodes
        workflow.nodes.forEach(node => {
            const nodeType = this.nodeTypes.find(nt => nt.type === node.type);
            if (!nodeType) return;
            
            // Create node element
            const nodeElement = document.createElement('div');
            nodeElement.className = `node node-${nodeType.category.toLowerCase()}`;
            nodeElement.id = node.id;
            nodeElement.style.left = `${
