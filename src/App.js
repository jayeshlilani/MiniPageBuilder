import logo from './logo.svg';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import './App.css';
import {Draggable, Droppable} from 'react-drag-and-drop'

let uiForm = [];
let dragFlag = true;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            change: true,
            draggedElement: null,
            uiElements: [],
            formDisplay: 'none',
            reDragId: 0,
            X: 0,
            Y: 0,
            Text: 'text',
            FontWeight: 50,
            FontSize: 16,
            id: 0
        };
        this.onKeyUp = this.onKeyUp.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);

        if (localStorage.getItem('uiElements') != null) {
            this.state.uiElements = JSON.parse(localStorage.getItem('uiElements'))
        }
    }

    onDragStart = (event) => {
        this.setState({
            draggedElement: event.target.innerText
        });
        dragFlag = true
    }


    myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({[nam]: val});
    }

    onDrop(data, event) {
        this.setState({X: event.pageX, Y: event.pageY, text: 'Text', fontSize: 16, fontWeight: 50})
        this.setState({formDisplay: 'block'})

    }

    createElement = (event) => {
        this.setState({formDisplay: 'none'})
        let temp = this.state.uiElements
        temp.push({
            name: this.state.draggedElement.toLowerCase(),
            style: {
                position: 'absolute',
                top: this.state.Y + 'px',
                left: this.state.X + 'px',
                fontSize: this.state.FontSize + 'px',
                fontWeight: this.state.FontWeight + 'px'
            },
            id: 'element' + this.state.X + this.state.Y,
            zIndex: 1
        })
        this.setState({uiElements: temp})
        localStorage.setItem('uiElements', JSON.stringify(this.state.uiElements))
    }

    onReDrag = (event, id, a) => {
        let elementId = id.target.firstChild.id
        let uiElementsTemp = this.state.uiElements
        uiElementsTemp.forEach((item, i) => {
            if (item.id == elementId) {
                var temp = {
                    name: uiElementsTemp[i].name,
                    style: {
                        position: 'absolute',
                        top: id.pageY + 'px',
                        left: id.pageX + 'px',
                        fontSize: uiElementsTemp[i].style.FontSize + 'px',
                        fontWeight: uiElementsTemp[i].style.FontWeight + 'px'
                    },
                    id: 'element' + id.pageX + id.pageY,
                    zIndex: 1
                }
                uiElementsTemp.splice(i, 1)
                uiElementsTemp.push(temp)
            }
        })
        this.setState({uiElements: uiElementsTemp})
        localStorage.setItem('uiElements', JSON.stringify(this.state.uiElements))
    }

    onKeyUp(event, item) {
        if (event.charCode === 13) {
            let uiElementsTemp = this.state.uiElements
            uiElementsTemp.forEach((item, i) => {
                if (item.id == event.target.id) {
                    this.state.Text = item.style.name
                    this.state.FontWeight = item.style.fontWeight.substr(0, item.style.fontWeight.length - 2)
                    this.state.FontSize = item.style.fontSize.substr(0, item.style.fontSize.length - 2)
                    this.state.Y = item.style.top.substr(0, item.style.top.length - 2)
                    this.state.X = item.style.left.substr(0, item.style.left.length - 2)
                    uiElementsTemp.splice(i, 1)
                }
            })
            this.setState({uiElements: uiElementsTemp})
            this.setState({formDisplay: 'block'})
            localStorage.setItem('uiElements', JSON.stringify(this.state.uiElements))

        }
    }

    onKeyDown(event, item) {
        if (event.key == 'Delete') {
            let uiElementsTemp = this.state.uiElements
            uiElementsTemp.forEach((item, i) => {
                if (item.id == event.target.id) {
                    uiElementsTemp.splice(i, 1)
                }
            })
            this.setState({uiElements: uiElementsTemp})
            localStorage.setItem('uiElements', JSON.stringify(this.state.uiElements))
        }
    }

    onFocus(event, id) {
        var index=0
        let uiElementsTemp = this.state.uiElements;
        uiElementsTemp.forEach((item, i) => {
                if (item.id == event.target.id) {
                    index = i
                }
            }
        )
        var temp = {
            name: uiElementsTemp[index].name,
            style: {
                position: 'absolute',
                top: uiElementsTemp[index].style.top,
                left: uiElementsTemp[index].style.left,
                fontSize: uiElementsTemp[index].style.FontSize,
                fontWeight: uiElementsTemp[index].style.FontWeight,
                borderColor: '#f00'
            },
            id: uiElementsTemp[index].id,
            zIndex: 1
        }
        uiElementsTemp.splice(index, 1)
        uiElementsTemp.push(temp)
        this.setState({uiElements: uiElementsTemp})

    }

    onBlur(event, item) {
        var index = 0
        let uiElementsTemp = this.state.uiElements
        uiElementsTemp.forEach((item, i) => {
            if (item.id == event.target.id) {
                index = i
            }
        })
        var temp = {
            name: uiElementsTemp[index].name,
            style: {
                position: 'absolute',
                top: uiElementsTemp[index].style.top,
                left: uiElementsTemp[index].style.left,
                fontSize: uiElementsTemp[index].style.FontSize,
                fontWeight: uiElementsTemp[index].style.FontWeight
            },
            id: uiElementsTemp[index].id,
            zIndex: 1
        }
        uiElementsTemp.splice(index, 1)
        uiElementsTemp.push(temp)
        this.setState({uiElements: uiElementsTemp})
    }

    render() {

        let uiForm = (
            <form>
                <div className="UIFormContainer">
                    <h1>Edit {this.state.draggedElement}</h1>
                    <div className="mb-3">
                        <label htmlFor="Text" className="form-label">Text</label>
                        <input type="text" className="form-control" id="Text" name="Text"
                               onChange={this.myChangeHandler}
                               aria-describedby="Text" value={this.state.Text}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="X" className="form-label">X</label>
                        <input type="text" className="form-control" id="X" name="X" onChange={this.myChangeHandler}
                               aria-describedby="X" value={this.state.X}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="Y" className="form-label">Y</label>
                        <input type="text" className="form-control" id="Y" name="Y" onChange={this.myChangeHandler}
                               aria-describedby="Y" value={this.state.Y}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="FontSize" className="form-label">Font Size</label>
                        <input type="text" className="form-control" id="FontSize" name="FontSize"
                               onChange={this.myChangeHandler}
                               aria-describedby="FontSize" value={this.state.FontSize}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="FontWeight" className="form-label">Font Weight</label>
                        <input type="text" className="form-control" id="FontWeight" name="FontWeight"
                               onChange={this.myChangeHandler.bind(this)}
                               aria-describedby="FontWeight" placeholder={'Font Weight of element'}
                               value={this.state.FontWeight}/>
                    </div>
                    <button type="button" className="btn btn-primary" onClick={this.createElement}>
                        Save Changes
                    </button>
                </div>
            </form>)

        return (
            <Container fluid className="Home">
                <Row>
                    <Col sm={9}>
                        <Droppable
                            className="DroppableArea"
                            id="droppableArea"
                            types={['element']} // <= allowed drop types
                            onDrop={this.onDrop.bind(this)}>
                            <div style={{display: this.state.formDisplay}}>
                                {uiForm}
                            </div>
                            <div>
                                {this.state.uiElements.map((item, key) => (
                                    <Draggable type={item.name} data="label" className="DragableElement"
                                               style={{width: 0, padding: 0}}
                                               onDragEnd={this.onReDrag.bind(this, item.id)}>
                                        <item.name value={item.name} id={item.id} style={item.style} key={key}
                                                   onKeyPress={this.onKeyUp} onKeyDown={this.onKeyDown}
                                                  /*onFocus={this.onFocus.bind(this)} onBlur={this.onBlur}>*/
                                            >
                                            {item.name != 'input' ? item.name : null}
                                        </item.name>
                                    </Draggable>
                                ))}
                            </div>
                        </Droppable>
                    </Col>
                    <Col className="ElementBucket" sm={3}>
                        <Row>
                            <Col sm={12}>
                                <h1 style={{color: '#fff'}}>BLOCKS</h1>
                            </Col>
                            <Col sm={12}>
                                <Draggable type="element" data="label" className="DragableElement"
                                           onDragStart={this.onDragStart.bind(this)}>
                                    <li>Label</li>
                                </Draggable>
                            </Col>
                            <Col sm={12}>
                                <Draggable type="element" data="input" className="DragableElement"
                                           onDragStart={this.onDragStart.bind(this)}>
                                    <li>Input</li>
                                </Draggable>
                            </Col>
                            <Col sm={12}>
                                <Draggable type="element" data="button" className="DragableElement"
                                           onDragStart={this.onDragStart.bind(this)}>
                                    <li>Button</li>
                                </Draggable>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default App;
