import React, { useState, useEffect } from 'react';
import {MenuItem,FormControl,Select, Card,CardContent} from '@material-ui/core'

import './App.css';
import Axios from 'axios';
import InfoBox from './component/InfoBox/InfoBox'
import Map from './containers/Map/Map'
import Table from './component/Table/Table'
import {sortData,prettyPrintStat} from './util'
import LineGraph from './component/LineGraph/LineGraph'

import "leaflet/dist/leaflet.css";

// https://disease.sh/v3/covid-19/countries

function App() {

  const[countries,setCountries] = useState([])
  const [country, setcountry] = useState('worldwide')
  const [countryInfo, setcountryInfo] = useState({})
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 })
  const [mapZoom, setMapZoom] = useState(2)
  const [mapCountries, setMapCountries] = useState([])
  const [casesType, setCasesType] = useState("cases")

  useEffect(() => {
    Axios.get('https://disease.sh/v3/covid-19/all')
      .then(res => (
        setcountryInfo(res.data)
      ))
  },[])

  useEffect(() => {
    Axios.get("https://disease.sh/v3/covid-19/countries")
      .then(response => {
        const countries = response.data.map((country) => (
          {
            name:country.country,
            value:country.countryInfo.iso2
          }
        ))
        const sortedData = sortData(response.data)
        setTableData(sortedData)
        setMapCountries(response.data);
        setCountries(countries)
      })
      // console.log('use Effect')

  },[])
  
  const onCountryChange = (e) => {
    const countryCode = e.target.value
    setcountry(countryCode)

    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`

    Axios.get(url)
      .then(res => {
        setcountryInfo(res.data)
        if(countryCode === 'worldwide'){
          setMapCenter(mapCenter);
          setMapZoom(mapZoom);
        } else {
          setMapCenter([res.data.countryInfo.lat, res.data.countryInfo.long]);
          setMapZoom(4);
        }
      })

  }

  return (
    <div className="app">
    <div className="app__left">
      <div className="app__header">
        <h1>COVID-19 Tracker</h1>
        <FormControl className="app__dropdown">
          <Select variant="outlined" onChange={onCountryChange} value={country}>
            <MenuItem value="worldwide">Worldwide</MenuItem>
            {countries.map((country) => (
              <MenuItem value={country.value}>{country.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className="app__stats">
        <InfoBox
          isRed
          active={casesType === "cases"}
          onClick={e => setCasesType('cases')}
          title="Coronavirus Cases Today"
          cases={prettyPrintStat(countryInfo.todayCases)}
          total={prettyPrintStat(countryInfo.cases)}
        />
        <InfoBox
          active={casesType === "recovered"}
          onClick={e => setCasesType('recovered')}
          title="Recovered Today"
          cases={prettyPrintStat(countryInfo.todayRecovered)}
          total={prettyPrintStat(countryInfo.recovered)}
        />
        <InfoBox
          isRed
          active={casesType === "deaths"}
          onClick={e => setCasesType('deaths')}
          title="Deaths Today"
          cases={prettyPrintStat(countryInfo.todayDeaths)}
          total={prettyPrintStat(countryInfo.deaths)}
        />
      </div>
      <Map 
        casesType={casesType}
        countries={mapCountries} 
        center={mapCenter} 
        zoom={mapZoom} 
      />
    </div>
    <Card className="app__right">
      <CardContent>
        <h3 className="app__rightTableTitle">current cases by country</h3>
        <Table countries={tableData} />
        <h3 className="app__rightGraphTitle">new daily {casesType} worldwide</h3>
        <LineGraph className="app__graph" casesType={casesType} />
      </CardContent>   
    </Card>
  </div>
);
}

export default App;
