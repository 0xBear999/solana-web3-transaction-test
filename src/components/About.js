
import * as React from 'react';
import { useState, useEffect } from "react";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import * as web3 from "@solana/web3.js";
import { Connection, Keypair, ConfirmedSignaturesForAddress2Options } from "@solana/web3.js";
import { getOrca, OrcaFarmConfig, OrcaPoolConfig, OrcaU64 } from "@orca-so/sdk";
import Decimal from "decimal.js";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function About() {


  const [showState, setToggleShowListState] = useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = React.useState([]);
  // useEffect(() => {

  // }, [rows]);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleToggleShowListState = () => {
    setToggleShowListState(!showState);
    // if (showState) {
    //   // showTransactionList();
    //   createRows();
    // }
  }
  useEffect(() => {
    if (showState) {
      createRows();
      console.log('showState ->' + showState);
    }
  }, [showState]);

  const columns = [
    { id: 'signature', label: 'Signature', minWidth: 170 },
    { id: 'block', label: '\u00a0Block', minWidth: 100 },
    {
      id: 'time',
      label: 'Time',
      minWidth: 170,
      align: 'left',
      // format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'instructions',
      label: '\u00a0(\u00b2)Instructions',
      minWidth: 170,
      align: 'left',
      // format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'by',
      label: 'By',
      minWidth: 170,
      align: 'left',
      // format: (value) => value.toFixed(2),
    },
    {
      id: 'fee',
      label: 'Fee(SOL)',
      minWidth: 170,
      align: 'left',
      // format: (value) => value.toFixed(2),
    },
    {
      id: 'result',
      label: 'Result',
      minWidth: 170,
      align: 'left',
      // format: (value) => value.toFixed(2),
    },
  ];
  let rowsTemp = [];
  var transactionLists = [];
  const openModal = (signature) => {

  };
  const createRows = async () => {
    var connection = new Connection("https://api.mainnet-beta.solana.com", "singleGossip");


    const pubLPkey = new web3.PublicKey(OrcaPoolConfig.mSOL_USDC);
    connection = new web3.Connection(web3.clusterApiUrl('mainnet-beta'), 'confirmed');

    const transactionCount = await connection.getTransactionCount();
    console.log("transaction counts==========" + transactionCount);
    // const confirmedTransaction = await connection2.getConfirmedTransaction('4d47vWY5MUPrgzynsnBJ434eaBDmctTvYhsiPUbmhLzhqmbVuCrAYcaG7xbJXccxssjQ4dgKMQpzWCDTJmvCi1QN', 'confirmed');
    //ConfirmedSignaturesForAddress2Options
    let limits = 1000;
    let option = { limit: limits };
    let d = new Date();
    let m = d.getMonth();
    d.setMonth(d.getMonth() - 1);
    // If still in same month, set date to last day of 
    // previous month
    if (d.getMonth() === m) d.setDate(0);
    d.setHours(0, 0, 0, 0);

    let tpubKey = [];
    var signatures = [];
    var endflag = true;
    // const tD = await connection.getTransaction(tpubKey[0].signature, 'confirmed');
    do {
      let starttime = performance.now();
      tpubKey = await connection.getConfirmedSignaturesForAddress2(pubLPkey, option, 'confirmed');

      console.log('get 1000 signatures requests duration --->', performance.now() - starttime);

      // tpubKey.forEach((e) => {
      //   signatures.push(e.signature);
      // });
      var step = 0;
      do {
        for (let i = 0; i < 100; i++) {
          if (tpubKey[i + step]) {
            signatures.push(tpubKey[i + step].signature);
          }
          else {
            endflag = false;
            break;
          }
        }
        console.log("signature lenght: ", signatures.length);

        //
        starttime = performance.now();
        let tDetails = await connection.getParsedConfirmedTransactions(signatures, 'confirmed');
        for (let index = 0; index < signatures.length; index++) {
          let signature = tpubKey[index].signature;
          let time = new Date(tDetails[index].blockTime * 1000 + 3600 * 8).toString();
          let instructions = "Approve";
          let block = tDetails[index].transaction.message.recentBlockhash;
          let by = '';
          for (let i = 0; i <= tDetails[index].transaction.message.accountKeys.length; i++) {
            if (tDetails[index].transaction.message.accountKeys[i].signer) {
              by = tDetails[index].transaction.message.accountKeys[i].pubkey.toString();
              break;
            }
          }
          let result = 'failed';
          if (tDetails[index].meta.err === null) result = 'success';

          let fee = tDetails[index].meta.fee / 1000000000;
          let detail = {};

          transactionLists.push({ signature, block, time, instructions, by, fee, result });
        }

        //test
        // console.log("input 100 transactiondetails into an array : ", performance.now() - starttime);
        //
        signatures = [];
        step += 100;
      } while (endflag)
      console.log("endflag: ", endflag);
      // console.log("first blocktime=>  ", tpubKey[tpubKey.length - 1].blockTime, "total singatures=>", signatures.length);
      // starttime = performance.now();
      // let endtime = performance.now();
      // console.log('transactin detail request duration --->', endtime - starttime);

    } while (tpubKey[tpubKey.length - 1].blockTime > d / 1000);//

    //
    console.log(transactionLists);




    console.log(tpubKey.length);
    for (let index = 0; index < 10; index++) {

      const tDetail = await connection.getParsedConfirmedTransaction(tpubKey[index].signature, 'confirmed');
      var signature = tpubKey[index].signature;
      var time = new Date(tDetail.blockTime * 1000 + 3600 * 8).toString();
      var block = tDetail.transaction.message.recentBlockhash;
      var instructions = "Approve";
      var by = '';
      for (var i = 0; i <= tDetail.transaction.message.accountKeys.length; i++) {
        if (tDetail.transaction.message.accountKeys[i].signer) {
          by = tDetail.transaction.message.accountKeys[i].pubkey.toString();
          break;
        }
      }
      var result = 'failed';
      if (tDetail.meta.err === null) result = 'success';

      var fee = tDetail.meta.fee / 1000000000;
      var detail = {};

      rowsTemp.push({ signature, block, time, instructions, by, fee, result });
      setRows(rowsTemp);

      // console.log(rows);
      // console.log(tD.transaction.signatures);
      // console.log(tD.transaction.message.instructions.accounts);
      // tDetail.transaction.message.accountKeys.forEach((e) => {
      //     console.log(e.pubkey.toString(), e.signer);
      // });
      // console.log('transaction message-----------------');
      // console.log(tDetail.transaction.message);
      // console.log("---------------------transaction message end.");
      // console.log(tDetail.transaction.signatures);
      // console.log("slot information : " + tDetail.slot);
      // console.log("meta information ---------- ");
      // console.log(tDetail.meta);
      // if (tDetail.meta.err === null) console.log('transaction successed!!!!');
      // else console.log('transaction failed!!!!');
      // console.log("-----------------------------");
      // console.log(tDetail.transaction.message.accountKeys);
    }
  };

  // console.log(pubLPkey);

  // ff.forEach((e) => {
  //     console.log(e.signature);

  // });
  //console.log(ff);//JSON.stringify(ff)


  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Item>

            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      rows.length > 0 &&
                      rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => {
                          return (
                            <TableRow key={row.signature} onClick={() => openModal(row.signature)}>
                              {columns.map((column) => {
                                const value = row[column.id];
                                return (
                                  <TableCell key={column.id}>
                                    {value}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          );
                        })

                    }
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </Item>
          <Button variant="outlined" onClick={() => handleToggleShowListState()}>Show list</Button>

        </Grid>

      </Grid>
    </Box >
  );
}
