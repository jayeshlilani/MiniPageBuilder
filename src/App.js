import logo from './logo.svg';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import './App.css';
import {Draggable, Droppable} from 'react-drag-and-drop'

let uiForm = [];
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            change: true,
            draggedElement: null,
            uiElements: [],
            formDisplay: 'none'
        };
    }

    onDragStart = (event) => {
        this.setState({
            draggedElement: event.target.innerText
        });
    }

    myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({[nam]: val});
    }

    onDrop(data, event) {
        uiForm = (
            <form>
                <div className="UIFormContainer">
                    <h1>Edit {this.state.draggedElement}</h1>
                    <div className="mb-3">
                        <label htmlFor="Text" className="form-label">Text</label>
                        <input type="text" className="form-control" id="Text" name="Text"
                               onChange={this.myChangeHandler}
                               aria-describedby="Text" placeholder={'This is a ' + this.state.draggedElement}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="X" className="form-label">X</label>
                        <input type="text" className="form-control" id="X" name="X" onChange={this.myChangeHandler}
                               aria-describedby="X" value={event.pageX} readOnly/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="Y" className="form-label">Y</label>
                        <input type="text" className="form-control" id="Y" name="Y" onChange={this.myChangeHandler}
                               aria-describedby="Y" value={event.pageY} readOnly/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="FontSize" className="form-label">Font Size</label>
                        <input type="text" className="form-control" id="FontSize" name="FontSize"
                               onChange={this.myChangeHandler}
                               aria-describedby="FontSize" placeholder={'Font Size of element'}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="FontWeight" className="form-label">Font Weight</label>
                        <input type="text" className="form-control" id="FontWeight" name="FontWeight"
                               onChange={this.myChangeHandler}
                               aria-describedby="FontWeight" placeholder={'Font Weight of element'}/>
                    </div>
                    <button type="button" className="btn btn-primary" onClick={this.createElement.bind(this)}>
                        Save Changes
                    </button>
                </div>
            </form>)
        this.setState({formDisplay: 'block', X: event.pageX, Y: event.pageY})
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
    }

    render() {
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
                                    <item.name value={item.name} id={item.id} style={item.style} key={key}>
                                        {item.name != 'input' ? item.name : null}
                                    </item.name>
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