import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Button,
  Modal, ModalHeader, ModalBody, ModalFooter,
  FormGroup, Form, Input, Label,
} from 'reactstrap';

import { ORGANIZATIONS_DETAIL_API, ORGANIZATION_API } from 'utils/constants';


/* eslint-disable */
export default class ListOrganizations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accessToken: window.sessionStorage.getItem('accessToken'),
      userId: window.sessionStorage.getItem('userId'),
      modal: false,
      accountId: this.props.match.params.id,
      organizations: [],
      orgModal: false,

    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.toggle = this.toggle.bind(this);
    this.orgToggle = this.orgToggle.bind(this);
    this.getOrganizations = this.getOrganizations.bind(this);
    this.addOrganization = this.addOrganization.bind(this);

  }


  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({ [name]: value });
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  orgToggle() {
    this.setState({
      orgModal: !this.state.orgModal
    });
  }

  getOrganizations() {
    const getOrganizationUrl = ORGANIZATIONS_DETAIL_API;
    return axios.get(getOrganizationUrl, {
      params: {
        term:'Spring 2020',
        access_token: this.state.accessToken
      },
    }).then(response => {
      console.log(response.data);
      this.setState({ organizations: response.data.orgs_array });
    });
  
  }
    addOrganization() {
      axios({
        method: 'post',
        url: ORGANIZATION_API,
        params: {
          access_token: this.state.accessToken
        },
        data: {
          name: this.state.orgName,
          description: this.state.orgDescription
        }
      }).then(response => {
        this.orgToggle();
        this.getOrganizations();
      });
    }

  componentDidMount() {
    document.title = 'Organization List Portal';
    this.getOrganizations();
  }

  render() {
    return (
            <div className='container-fluid'>
              <div className='row'>
                <div className='col-sm-12'>
                  {/*<div className='page-title-box'>
                    <div className='btn-group pull-right'>
                      <ol className='breadcrumb hide-phone p-0 m-0'>
                        <li className='breadcrumb-item'>Admin</li>
                        <li className='breadcrumb-item'>Organizations </li>
                      </ol>
                      </div>
                    <h4 className='page-title m-b-10'>Admin Dashboard</h4>
                  </div>*/}
                </div>
              </div>

              <div className='row'>
                <div className='col-lg-12'>
                  <div className='card-box'>
                    <div className='row'>
                      <div className='col-lg-12'>
                        <h3>Organizations </h3>
                      </div>
                    </div>

                    <div className='tab-pane' id='organizations'>
                      <div className='row'>
                        {this.state.organizations.map(org => {
                          
                          var activityRate, feedbackRate;
                          if(org.feedbackRate == null){
                            feedbackRate ='No courses yet.';
                            activityRate ='No courses yet.';
                          }else{
                            feedbackRate = (org.feedbackRate*100).toFixed(2)+'%';
                            activityRate = (org.activityRate*100).toFixed(2)+'%';
                          }
                          return (
                            <div className='col-lg-3' key={org.id}>
                              <div className='portlet'>
                                <div className='portlet-heading bg-inverse-light'>
                                  <h3 className='portlet-title text-inverse text-flow'>
                                    {org.name}
                                  </h3>
                                  <div className='portlet-widgets'>
                                    <span className='divider'></span>
                                    <a data-toggle='collapse' data-parent='#accordion1' href={'#' + org.id}><span className='divider'></span><i className='ion-minus-round'></i> &nbsp;</a>

                                  </div>
                                  <div className='clearfix'></div>
                                </div>
                                <Link to={`/organization_dashboard/${org.id}`}>
                                  <div id={org.id} className='panel-collapse collapse show portlet-min-height'>
                                    <div className='portlet-body'>
                                      <b className='text-muted'>Organization Name:</b><br /> {org.name} <br />
                                      <b className='text-muted'>Description:</b><br /> {org.description} <br />
                                      <b className='text-muted'>Feedback Rate:</b><br /> {feedbackRate} <br />
                                      <b className='text-muted'>Activity Rate:</b><br /> {activityRate} <br />

                                    </div>
                                  </div>
                                </Link>
                              </div>
                            </div>
                          )
                        })}
                        <div className='col-lg-3'>
                          <div className='portlet'>
                            <div className='portlet-heading bg-inverse-light'>
                              <h3 className='portlet-title text-inverse'>
                              </h3>
                              <div className='portlet-widgets'>
                                <span className='divider'></span>
                                <a data-toggle='collapse' data-parent='#accordion1' href={'#addNew'}></a>
                              </div>
                              <div className='clearfix'></div>
                            </div>
                            <Link to={`#`}>
                              <div id='addNew' className='panel-collapse collapse show'>
                                <div className='portlet-body text-center p-b-20' onClick={this.orgToggle}>
                                  <b className='text-muted'></b><br /><i className='md md-add font-18'></i><br />Add New Organization
                                  <b className='text-muted'></b><br /><br />
                                </div>
                              </div>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Modal isOpen={this.state.orgModal} toggle={this.orgToggle} className={this.props.className}>
                      <ModalHeader toggle={this.orgToggle}>Add Organization</ModalHeader>
                      <ModalBody>
                        <Form>
                          <FormGroup>
                            <Label>Organization Name:</Label>
                            <Input
                              type='text'
                              name='orgName'
                              onChange={this.handleInputChange} />
                            <Label>Description:</Label>
                            <Input
                              type='text'
                              name='orgDescription'
                              onChange={this.handleInputChange} />
                          </FormGroup>
                        </Form>
                      </ModalBody>
                      <ModalFooter>
                        <Button color='primary' onClick={this.addOrganization}>Add</Button>{' '}
                        <Button color='danger' onClick={this.orgToggle}>Cancel</Button>
                      </ModalFooter>
                    </Modal>
                  </div>
                </div>
              </div>
            </div>
    );
  }
}
/* eslint-enable */
