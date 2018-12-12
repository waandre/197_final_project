import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

class Bills extends Component {
  constructor(props) {
    super(props)
    this.state = {bill: [], owed: 0}
  }
  componentDidMount() {
    fetch("/bills")
    .then(resp => resp.json())
    .then(d => {
      this.setState({bill: d.data})
    })
    fetch("/owe")
    .then(resp => resp.json())
    .then(d => {
      this.setState({owed: d.data[0].amountOwed})
    })
  }
  render() {
    const { classes } = this.props;
    var createBillRow = function(bill) {
      return (
        <TableRow key={bill._id}>
          <CustomTableCell>{bill.name}</CustomTableCell>
          <CustomTableCell>{bill.purchaser}</CustomTableCell>
          <CustomTableCell>{bill.cost}</CustomTableCell>
          <CustomTableCell>{bill.datePurchased}</CustomTableCell>
          <CustomTableCell>
            <form action='/splitbill' method='post'>
              <input type="submit" value="Split" name={bill._id}/>
            </form>
          </CustomTableCell>
        </TableRow>
      )
    }
    return (
      <div>
        <h4>Bills</h4>
        <p>You owe: ${parseFloat(this.state.owed).toFixed(2)}</p>
        <Paper className={classes.root}>
          <Table className={classes.table} >
            <TableHead>
              <TableRow>
                <CustomTableCell>Bill:</CustomTableCell>
                <CustomTableCell>Covered By:</CustomTableCell>
                <CustomTableCell>Amount: </CustomTableCell>
                <CustomTableCell>Paid on: </CustomTableCell>
                <CustomTableCell>Split: </CustomTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.bill.map(createBillRow, this)}
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

export default withStyles(styles)(Bills);
