import React, { Component } from 'react'
import scriptLoader from 'react-async-script-loader'

import PlacesList from './PlacesList'
import logo from './logo.svg'
import { FS, FS_API_SEARCH_URL, MAP_API_KEY, mapCenter } from './data'

class App extends Component {
  constructor(props) {
    super(props)
    this.mapRef = React.createRef()
  }

  state = {
    isMapScriptLoaded: false,
    places: [],
    map: null,
  }

  componentDidMount = () => {
    fetch(FS_API_SEARCH_URL)
    .then(res => res.json())
    .then(data => this.setState({ places: data.response.venues }))
  }
  
  static getDerivedStateFromProps({ isScriptLoadSucceed }, prevState) {
    if (isScriptLoadSucceed) {
      const map = new window.google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: mapCenter,
      })
      return { ...prevState, map, isMapScriptLoaded: true }
    }
    else return null
  }

  render() {
    const { places } = this.state
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <section id="map" ref={this.mapRef} className="map" role="application">
          <header>Here will be map</header>
        </section>
        <PlacesList places={places} />
      </div>
    )
  }
}

export default scriptLoader(
  [`https://maps.googleapis.com/maps/api/js?key=${MAP_API_KEY}`])
  (App)