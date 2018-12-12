import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

class Groceries extends Component {
  constructor(props) {
    super(props)
    this.state = {groceries: [], needed: []}
  }
  componentDidMount() {
    fetch("/groceries")
    .then(resp => resp.json())
    .then(d => this.setState({groceries: d.data}))
    fetch("/needed")
    .then(resp => resp.json())
    .then(d => this.setState({needed: d.data}))
  }
  render() {
    const { classes } = this.props;
    var createGroceryRow = function(grocery) {
      return (
        <TableRow key={grocery._id}>
          <CustomTableCell>{grocery.name}</CustomTableCell>
          <CustomTableCell>{grocery.cost}</CustomTableCell>
          <CustomTableCell>{grocery.purchaser}</CustomTableCell>
          <CustomTableCell>{grocery.datePurchased}</CustomTableCell>
        </TableRow>
      )
    }

    var createNeededRow = function(need) {
      return (
        <TableRow key={need._id}>
          <CustomTableCell>{need.name}</CustomTableCell>
          <CustomTableCell>{need.addedBy}</CustomTableCell>
          <CustomTableCell>
            <form action='/completegroceryneeded' method='post'>
              <input type="text" placeholder="$$" name='cost'/>
              <input type="submit" value="Complete Grocery" name={need._id}/>
            </form>
          </CustomTableCell>
          <CustomTableCell>
            <form action='/deletegroceryneeded' method='post'>
              <input type="submit" value="Delete Grocery" name={need._id}/>
            </form>
          </CustomTableCell>
        </TableRow>
      )
    }
 
    return (
      <div >
        <h4>Previously Purchased Groceries</h4>
        <Paper className={classes.root}>
          <Table className={classes.table} >
            <TableHead>
              <TableRow>
                <CustomTableCell>Item</CustomTableCell>
                <CustomTableCell>Price</CustomTableCell>
                <CustomTableCell>Purchased By</CustomTableCell>
                <CustomTableCell>Purchased On</CustomTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.groceries.map(createGroceryRow, this)}
            </TableBody>
          </Table>
        </Paper>
        <h4>Needed Groceries</h4>
        <form action="/addGroceryNeeded" method='post'>
          Item: <input type='text' name='item'/>
          <input type="submit" value="Add Grocery"/>
        </form>
        <Paper className={classes.root}>
          <Table className={classes.table} >
            <TableHead>
              <TableRow>
                <CustomTableCell>Item Needed:</CustomTableCell>
                <CustomTableCell>Added By:</CustomTableCell>
                <CustomTableCell>Complete: </CustomTableCell>
                <CustomTableCell>Delete: </CustomTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.needed.map(createNeededRow, this)}
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }
}
const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontSize: 18,
  },
  body: {
    fontSize: 14.5,
  },
}))(TableCell);

const styles = theme => ({
  root: {
    width: '95%',
    margin: "15px",
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
});
export default withStyles(styles)(Groceries);
