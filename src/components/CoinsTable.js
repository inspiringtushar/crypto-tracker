import {
  Container,
  createTheme,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ThemeProvider,
  Typography,
} from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { CoinList } from "../config/api";
import { CryptoState } from "../CryptoContext";
import { numberWithCommas } from "./Banner/Carousel";
import "./CoinsTable.css";

const CoinsTable = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { currency, symbol } = CryptoState();
  const history = useHistory();
  const fetchCoins = useCallback(async () => {
    setLoading(true);
    const { data } = await axios.get(CoinList(currency));
    setCoins(data);
    setLoading(false);
  }, [currency]);

  useEffect(() => {
    fetchCoins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]);
  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      type: "dark",
    },
  });

  const handleSearch = useCallback(() => {
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search) ||
        coin.symbol.toLowerCase().includes(search)
    );
  }, [coins, search]);

  const showData = () => {
    const data = handleSearch();
    const len = data.length;
    const startIndexOfData = (page - 1) * 10;
    // if length of filtered coins is less than the range of coins to be shown on the particular page
    // then set page as 1, so that no situation occurs where user isn't able to get anything on the screen.
    if (len && len <= startIndexOfData) {
      setPage(1);
      return data.slice(0, 10);
    }
    return data.slice(startIndexOfData, startIndexOfData + 10);
  };
  return (
    <ThemeProvider theme={darkTheme}>
      <Container style={{ textAlign: "center" }}>
        <Typography
          variant="h4"
          style={{ margin: 20, fontFamily: "montserrat" }}
        >
          Crypto Currencies Prices by Market Cap
        </Typography>
        <TextField
          label="Search for a Crypto Currency"
          variant="outlined"
          style={{ width: "100%", marginBottom: 20 }}
          onChange={(e) => setSearch(e.target.value.toLowerCase())}
        ></TextField>
        <TableContainer>
          {loading ? (
            <LinearProgress
              style={{ backgroundColor: "gold" }}
            ></LinearProgress>
          ) : (
            <Table>
              <TableHead style={{ backgroundColor: "gold" }}>
                <TableRow>
                  {["Coin", "Price", "24h Change", "Market Cap"].map((head) => (
                    <TableCell
                      style={{
                        color: "black",
                        fontWeight: 700,
                        fontFamily: "montserrat",
                      }}
                      align={head === "Coin" ? "" : "right"}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {showData().map((row) => {
                  let profit = row.price_change_percentage_24h >= 0;
                  return (
                    <TableRow
                      onClick={() => history.push(`/coins/${row.id}`)}
                      key={row.name}
                      className="tablerow"
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        styles={{ display: "flex", gap: 15 }}
                      >
                        <img
                          src={row?.image}
                          alt={row.name}
                          height="50"
                          style={{ marginBottom: 10 }}
                        ></img>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <span
                            style={{
                              textTransform: "uppercase",
                              fontSize: 20,
                            }}
                          >
                            {row.symbol}
                          </span>
                          <span style={{ color: "darkgray" }}>{row.name}</span>
                        </div>
                      </TableCell>
                      <TableCell align="right">
                        {symbol}{" "}
                        {numberWithCommas(row?.current_price.toFixed(2))}
                      </TableCell>
                      <TableCell
                        align="right"
                        style={{
                          color: profit ? "green" : "red",
                          fontWeight: 500,
                        }}
                      >
                        {profit && "+"}
                        {row?.price_change_percentage_24h?.toFixed(2)}%
                      </TableCell>
                      <TableCell align="right">
                        {symbol}{" "}
                        {numberWithCommas(
                          row?.market_cap.toString().slice(0, -6)
                        )}
                        M
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </TableContainer>
        <Pagination
          count={Math.ceil(handleSearch().length / 10)}
          style={{ display: "flex", justifyContent: "center" }}
          onChange={(_, value) => {
            setPage(value);
            window.scrollTo(0, 400);
          }}
        ></Pagination>
      </Container>
    </ThemeProvider>
  );
};

export default CoinsTable;
