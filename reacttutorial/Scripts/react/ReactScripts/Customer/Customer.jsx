import React from 'react';
import { Button, Header, Icon, Menu, Table, Modal, Form } from 'semantic-ui-react';

export default class Customer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            customerName: '',
            customerAddress: '',
            customerEditName = '',
            showModal: false,
            showEditModal : false,
            validationError: false,
            customerNameError: false,
            customerAddressError: false,
            formError: false,
            dataCustomer: '',
            detailsCustomer: null,
            notification : false
        }
        this.submitCustomer = this.submitCustomer.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleEditOpen = this.handleEditOpen.bind(this);
        this.handleEditClose = this.handleEditClose.bind(this);
        this.getCustomers = this.getCustomers.bind(this);
        this.editCustomer = this.editCustomer.bind(this);
        this.deleteCustomer = this.deleteCustomer.bind(this);
    }

    componentDidMount() {
        this.getCustomers();
        setTimeout(() => {
            this.setState({ notification : false });
        }, 3000);
        console.log(this.state.notification);
    }

    getCustomers() {
        var self = this;
        $.ajax({
            url: '/Default/GetCustomers',
            dataType: 'json',
            type: 'GET',
            success: (function (response) {
                console.log(response.result);
                if (response.result != null) {
                    self.setState({ dataCustomer: response.result })
                }
            })
        })
        console.log(self.state.dataCustomer);
    }

    deleteCustomer(props) {
        console.log(props.target.value);
        var customer = {
            Id: props.target.value
        }
        var self = this;
        $.ajax({
            url: '/Default/DeleteCustomer',
            type: 'POST',
            dataType: 'json',
            data: customer,
            success: function (response) {
                console.log(response);
                if (response) {
                    console.log("in success");
                    self.setState({ notification : true, notificationMessage: response.Message });
                    self.getCustomers();
                }
            }
        })
    }

    editCustomer(props) {
        console.log(props.target.value);
        return false;
        var customer = {
            Id: props.target.value,
            Name: this.state.customerEditName,
            Address: this.state.customerEditAddress
        }
        $.ajax({
            url: '/Default/EditCustomer',
            type: 'POST',
            dataType: 'json',
            data: customer,
            success: function (response) {
                alert(response);
                return false;
                if (response.result != null) {
                    alert(response.result);
                    return false;
                }
            }
        })
    }

    handleOpen() {
        this.setState({
            showModal: true
        })
    }
    handleEditOpen() {
        this.setState({
            showEditModal: true
        })
    }

    handleEditClose() {
        this.setState({
            showEditModal: false
        })
    }

    handleClose(){
        this.setState({
            showModal: false
        })
    }

    submitCustomer(dataName, dataAddress) {
        let validationError = false;
        if (this.state.customerName === '') {
            this.setState({ customerNameError: true })
            validationError = true
        } else {
            this.setState({ customerNameError: false })
            validationError = false
        }
        if (this.state.customerAddress === '') {
            this.setState({ customerAddressError: true })
            validationError = true
        } else {
            this.setState({ customerAddressError: false })
            validationError = false
        }
        if (validationError) {
            this.setState({ formError: true })
        } else {
            this.setState({ formError: false })
            var myCustomerData = {
                Name : this.state.customerName,
                Address : this.state.customerAddress
            }
            console.log(myCustomerData);
            var self = this;
            $.ajax({
                url: '/Default/AddCustomer',
                dataType: 'json',
                type: 'POST',
                data: myCustomerData,
                success: (function (response) { 
                    console.log("Saved");
                    self.getCustomers();
                    self.handleClose();
                })
            })
        }
    } 

    render() {
        var style = {
            "position" : "relative"
        }
        if (this.state.notification == true) {
            var notificationValue = < div className="ui floating message" >
                <p>{this.state.notificationMessage}</p>
            </div>;
        } else {
            var notificationValue = "";
        }

        if (this.state.dataCustomer) {
            this.state.detailsCustomer =
                this.state.dataCustomer.map((Customer,index) =>
                <Table.Body key={index}>
                    <Table.Row>
                        <Table.Cell>{Customer.Name}</Table.Cell>
                        <Table.Cell>{Customer.Address}</Table.Cell>
                        <Table.Cell>
                            <Modal
                                style={style}
                                trigger={<Button onClick={this.handleEditOpen} color='yellow' content='Edit' icon='edit' />}
                                onClose={this.handleEditClose}
                                open={this.state.showEditModal}
                                closeIcon>
                                <Modal.Header>Customer Details</Modal.Header>
                                <Modal.Content>
                                    <Form>
                                        <Form.Field>
                                            <label>Name</label>
                                            <Form.Input required={true} value={Customer.Name} onChange={(e) => this.setState({ customerEditName: e.target.value })}></Form.Input>
                                        </Form.Field>
                                        <Form.Field>
                                            <label>Address</label>
                                            <Form.Input required={true} value={Customer.Address} onChange={(e) => this.setState({ customerEditAddress: e.target.value })}></Form.Input>
                                        </Form.Field>
                                    </Form>
                                </Modal.Content>
                                <Modal.Actions>
                                    <Button type='submit' positive onClick={this.editCustomer} value={Customer.Id}>Update</Button>
                                    <Button onClick={this.handleEditClose}>Cancel</Button>
                                </Modal.Actions>
                            </Modal>

                            </Table.Cell>
                        <Table.Cell><Button onClick={this.deleteCustomer} color='red' value={Customer.Id} content='Delete' icon='trash alternate' /></Table.Cell>
                    </Table.Row>
                </Table.Body>
                );  
        } else {
            this.state.detailsCustomer = 
                <Table.Body>
                <Table.Row>
                    <Table.Cell>No Customer details found</Table.Cell>
                </Table.Row>
                </Table.Body>;
        }
        
        return (
            <div>
                {notificationValue}
                <Modal
                    style={style}
                    trigger={<Button onClick={this.handleOpen} primary>Add New Customer</Button>}
                    onClose={this.handleClose}
                    open={this.state.showModal}
                    closeIcon>
                    <Modal.Header>Customer Details</Modal.Header>
                    <Modal.Content>
                        <Form error={this.state.formError}>
                            <Form.Field>
                                <label>Name</label>
                                <Form.Input error={this.state.customerNameError} placeholder="Name" required={true} onChange={(e) => this.setState({ customerName: e.target.value })}></Form.Input>
                            </Form.Field>
                            <Form.Field>
                                <label>Address</label>
                                <Form.Input error={this.state.customerAddressError} placeholder="Address" required={true} onChange={(e) => this.setState({ customerAddress: e.target.value })}></Form.Input>
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button type='submit' positive onClick={this.submitCustomer} >Submit</Button>
                        <Button onClick={this.handleClose}>Cancel</Button> 
                    </Modal.Actions>
                </Modal>

                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Customer Name</Table.HeaderCell>
                            <Table.HeaderCell>Address</Table.HeaderCell>
                            <Table.HeaderCell>Action(Edit)</Table.HeaderCell>
                            <Table.HeaderCell>Action(Delete)</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    {this.state.detailsCustomer}
                </Table>
            </div>
        )
    }
}