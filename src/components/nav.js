import React, { Component } from 'react';
import { Breadcrumb } from 'semantic-ui-react'
import { Link } from 'react-router-dom'


class BreadcrumbExampleDivider extends Component {
  render() {
    const pstyle = {
      color: "blue",
      align: "center",
      marginBottom: "25px"
    }
    return (
      <Breadcrumb size='massive'>
          <Breadcrumb.Section><Link to='/'>Home</Link></Breadcrumb.Section>
          <Breadcrumb.Divider> | </Breadcrumb.Divider>
          <Breadcrumb.Section><Link to='/groceries'>Groceries</Link></Breadcrumb.Section>
          <Breadcrumb.Divider> | </Breadcrumb.Divider>
          <Breadcrumb.Section><Link to='/bills'>Bills</Link></Breadcrumb.Section>
          <h1 style={pstyle}>Roomate Helper</h1>
        </Breadcrumb>
    )
  }
}

export default BreadcrumbExampleDivider