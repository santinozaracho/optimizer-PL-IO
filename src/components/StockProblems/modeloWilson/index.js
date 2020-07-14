import React from "react";
import { ButtonGroup, Button, Container, Row, Col, Card, CardBody, CardHeader, CardTitle, Jumbotron, Dropdown, DropdownItem, ButtonDropdown, DropdownMenu, DropdownToggle} from "reactstrap";
import {InputGroupText,InputGroup, Input,InputGroupAddon,PopoverBody, CardText} from 'reactstrap';
import {Link} from 'react-router-dom';
import '../index.css'
import { Variable } from "javascript-lp-solver/src/expressions";



class ModeloWilson extends React.Component{
    constructor (props){
        super(props)
        this.state={
            demanda: null, //D
            costoDePreparacion: null, //K
            costoDePreparacionTotal: null,
            costoDeAlmacenamiento: null,//c1
            costoDeAlmacenamientoTotal: null,
            costoDeProducto: null, //b
            costoDeProductoTotal: null,
            unidadesAlmacenamiento: null,
            unidadesDemanda:null,
            loteOptimo:null, //q
            tiempoEntrePedidos: null, //t0
            mostrarResultados: false,
            inputUpdated: false,
            incompleto: false,
            CTE: null,
            
        }
    }

    componentDidUpdate(prevProps, prevState){ //Para comparar mi estado actual con el estado anterior. Verificamos si se actualizo algun campo de los input.
        if(this.state.inputUpdated){
            this.setState({inputUpdated:false})
            this.controlarCambio();
            
        } 
    }

    handleInputChange = (event) =>{
        this.setState({
            [event.target.name]: event.target.value,
            inputUpdated: true,
        })
    }

    //SI HUBO CAMBIOS QUE DESAPAREZCA LA VENTANA QUE MUESTRA LOS RESULTADOS
    controlarCambio = () => { 
        this.setState({mostrarResultados:false})
    }
    
    //CALCULAR q0
    calcularLoteOptimo() {
        let {costoDePreparacion, demanda, costoDeAlmacenamiento} = this.state;
        let loteOptimo
        loteOptimo = (Math.sqrt((2*Number(costoDePreparacion)*Number(demanda))/(Number(costoDeAlmacenamiento))));
        
        if (loteOptimo>demanda){ //Si el q0 calculado es mas grande que la demanda entonces como lote optimo va la demanda
            this.setState({loteOptimo: demanda})
        }else{
            this.setState({loteOptimo})
        }
    }

    //CALCULAR t0
    calcularTiempoEntrePedidos(){
        let {costoDePreparacion, demanda, costoDeAlmacenamiento} = this.state
        this.setState({tiempoEntrePedidos: (Math.sqrt(2*Number(costoDePreparacion)/ ((Number(demanda))*(Number(costoDeAlmacenamiento))))) })
        

    }

    //CALCULAR COSTO DE PREPARACION TOTAL
    calcularCostoPreparacionTotal(){
        let {demanda, loteOptimo, costoDePreparacion} = this.state;
        this.setState({costoDePreparacionTotal: ((Number(demanda)/Number(loteOptimo))*Number(costoDePreparacion)) })
    }

    //CALCULAR COSTO DEL PRODUCTO TOTAL
    calcularCostoProductoTotal(){
        let {costoDeProducto, demanda} = this.state;
        this.setState({costoDeProductoTotal: (Number(costoDeProducto)*Number(demanda)) })
    }

    //CALCULAR COSTO TOTAL DE ALMACENAMIENTO
    calcularCostoAlmacenamientoTotal(){
        let {loteOptimo, costoDeAlmacenamiento} = this.state;
        this.setState({costoDeAlmacenamientoTotal: ((1/2)*Number(loteOptimo)*Number(costoDeAlmacenamiento)) })
    }

    //CALCULAR CTE 
    calcularCTE(){
        let {costoDeProducto, costoDeAlmacenamiento, demanda} = this.state
        let bD, raiz2TDKC1
        bD = (Number(costoDeProducto)*Number(demanda))
        raiz2TDKC1 = ( Math.sqrt(2*Number(demanda)*Number(costoDeProducto)*Number(costoDeAlmacenamiento)) )
        this.setState({CTE: (bD + raiz2TDKC1)})
    }


    mostrarResultados = () => {
        
        let {demanda, costoDePreparacion, costoDeAlmacenamiento, costoDeProducto} = this.state;
        let combinacion1 = [demanda, costoDePreparacion, costoDeAlmacenamiento, costoDeProducto] //Cargamos un arreglo
        let control1 = combinacion1.every(caso => caso); //Si devuelve true es porque todos los elementos del arreglo estan cargados 
        
        if (control1){ //SI TODOS LOS CAMPOS ESTAN CARGADOS ENTONCES CALCULO TODO Y MUESTRO
            this.calcularLoteOptimo()
            this.calcularTiempoEntrePedidos()
        
            setTimeout(() => {
                this.calcularCostoPreparacionTotal()
                this.calcularCostoProductoTotal()
                this.calcularCostoAlmacenamientoTotal()
                this.calcularCTE()
            }, 1);

            this.setState({mostrarResultados: true})
            this.setState({incompleto: false})

        }else{
            this.setState({incompleto:true}) //PONGO A INCOMPLETO EN TRUE Y MUESTRO LA ALERTA DE COMPLETAR CAMPOS
        }
        
        
                 
    }

    render() { 
        let {demanda, costoDePreparacion, costoDeAlmacenamiento,unidadesDemanda, loteOptimo, unidadesAlmacenamiento, incompleto} = this.state;
        let {costoDeProducto, costoDeProductoTotal, costoDePreparacionTotal, costoDeAlmacenamientoTotal, CTE, mostrarResultados, tiempoEntrePedidos} = this.state;
 
        
        return (
            <Container fluid className="App"> 
            <Row>
              <Col xs={12} md={8} className="my-4 mx-auto">
                <Jumbotron>
                    <Col>
                        <h2>Modelo Wilson</h2><br></br>                   
                    </Col>
                    
                    <Col> 
                        <InputGroup className="mt-3" id={"demanda"} key={"demanda"}>
                            <InputGroupAddon addonType="prepend">
                            <InputGroupText><b>{"D"}</b></InputGroupText>
                            </InputGroupAddon>
                            <Input
                            className="input-demanda"
                            name={"demanda"}
                            value={demanda}
                            placeholder="Ingresar la demanda"
                            aria-label="Demanda"
                            aria-describedby="demanda"
                            onChange={this.handleInputChange}
                            />
                            <InputGroupAddon className="input-unidades" addonType="prepend">
                            <InputGroupText><b>{"Unidades"}</b></InputGroupText>
                            </InputGroupAddon>
                            <Input
                            className="input-unidadesDemanda"
                            name={"unidadesDemanda"}
                            placeholder="Ingresar las unidades de demanda"
                            aria-label="UnidadDemanda"
                            aria-describedby="unidadDemanda"
                            onChange={this.handleInputChange}
                            />
                        </InputGroup>
                    </Col>
                    <Col>
                        <InputGroup className="mt-3" id={"costoDePreparacion"} key={"costoDePreparacion"}>
                            <InputGroupAddon addonType="prepend">
                            <InputGroupText><b>{"K"}</b></InputGroupText>
                            </InputGroupAddon>
                            <InputGroupAddon addonType="prepend">
                            <InputGroupText>{"$"}</InputGroupText>
                            </InputGroupAddon>
                            <Input
                            name={"costoDePreparacion"}
                            value={costoDePreparacion}
                            placeholder="Ingresar el costo por pedido"
                            aria-label="costoDePreparacion"
                            aria-describedby="costoDePreparacion"
                            onChange={this.handleInputChange}
                            />
                            
                        </InputGroup>
                    </Col>
                    <Col>
                        <InputGroup className="mt-3" id={"costoDeAlmacenamiento"} key={"costoDeAlmacenamiento"}>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText><b>{"c1"}</b></InputGroupText>
                            </InputGroupAddon>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText >{"$"}</InputGroupText>
                            </InputGroupAddon>
                            <Input
                            name={"costoDeAlmacenamiento"}
                            value={costoDeAlmacenamiento}
                            placeholder="Ingresar el costo de almacenamiento"
                            aria-label="costoDePreparacion"
                            aria-describedby="costoDePreparacion"
                            onChange={this.handleInputChange}
                            />  
                            
                            <InputGroupAddon className="unidadesAlmacenamiento" addonType="prepend">
                                <InputGroupText><b>{"Unidades"}</b></InputGroupText>
                            </InputGroupAddon>
                            <Input
                            className=""
                            name={"unidadesAlmacenamiento"}
                            placeholder="Ingresar las unidades de tiempo"
                            onChange={this.handleInputChange}
                            />
                        
                        </InputGroup>
                    </Col>
                    
                    <Col>
                        <InputGroup className="mt-3">
                            <InputGroupAddon addonType="prepend">
                            <InputGroupText><b>{"b"}</b></InputGroupText>
                            </InputGroupAddon>
                            <Input
                            name={"costoDeProducto"}
                            value={costoDeProducto}
                            placeholder="Ingresar el costo del producto x unidad."
                            aria-label="costoDeProducto"
                            aria-describedby="costoDeProducto"
                            onChange={this.handleInputChange}
                            />                        
                        </InputGroup>
                    </Col>
                                        
                    {mostrarResultados && (    //Si mostrarResultados esta en true que quiere decir que apreto el boton y que todos los campos estan completos
                                                          
                    <Col>
                        <Card body inverse style={{ backgroundColor: '#333', borderColor: '#333', marginTop:10}}>
                            <CardText>
                                <h6 style={{display:'inline'}}>El lote optimo es:</h6> <h5 style={{display:'inline'}}><b>{Number(loteOptimo).toFixed(2)}</b></h5><br></br>
                                <h6 style={{display:'inline'}}>El tiempo entre pedidos es:</h6> <h5 style={{display:'inline'}}><b>{Number(tiempoEntrePedidos).toFixed(2)}</b></h5><br></br>
                                <h6 style={{display:'inline'}}>El costo total de preparacion es:</h6> <h5 style={{display:'inline'}}><b>{Number(costoDePreparacionTotal).toFixed(2)}</b></h5><br></br>
                                <h6 style={{display:'inline'}}>El costo total propio del producto es:</h6> <h5 style={{display:'inline'}}><b>{Number(costoDeProductoTotal).toFixed(2)}</b></h5><br></br>
                                <h6 style={{display:'inline'}}>El costo total de almacenamiento es:</h6> <h5 style={{display:'inline'}}><b>{Number(costoDeAlmacenamientoTotal).toFixed(2)}</b></h5><br></br>
                                <h6 style={{display:'inline'}}>El costo total esperado es:</h6> <h5 style={{display:'inline'}}><b>${Number(CTE).toFixed(2)}</b></h5><br></br>
                                <Col>
                                    <Card body inverse color="primary" style={{marginTop:10, padding: '5px 0 0 0'}}>
                                        <CardText>
                                        <h5>Pedir {Number(loteOptimo).toFixed(2)} {unidadesDemanda} cada {Number(tiempoEntrePedidos).toFixed(2)} {unidadesAlmacenamiento}</h5>
                                        </CardText>
                                    </Card>   
                                </Col>
                            </CardText>
                        </Card>   
                    </Col>)}
                           
                    {incompleto && (
                    <Card className="card-incompleto" body inverse color="danger" style={{padding: '0 0 0 0', marginTop:10}}>
                        <CardText>Complete más campos para poder continuar y luego presione calcular.</CardText>
                    </Card>)}
                    
                    
                    <Row className="btn-volver justify-content-center">
                        <Link to='./'><Button>Volver</Button></Link>
                        <Button className="btn-Calcular" color="success" onClick={this.mostrarResultados}>Calcular</Button>
                    </Row>
                    
                </Jumbotron>
              </Col>
            </Row>
          </Container>
        );
      }



}

export default ModeloWilson;