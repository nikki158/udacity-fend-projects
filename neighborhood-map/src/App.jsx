import React, { Component, Fragment } from 'react'
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
    isMapLoaded: false,
    mapLoadingFailed: false,
    isPlacesLoaded: false,
    placesLoadingFailed: false,
    places: [],
    map: null,
  }

  componentDidUpdate = () => {
    const { isPlacesLoaded, isMapLoaded, placesLoadingFailed } = this.state
    console.log(this.state)
    if (isMapLoaded && !isPlacesLoaded && !placesLoadingFailed) {
      this.fetchPlacesData()
    }
  }
  

  static getDerivedStateFromProps({ isScriptLoadSucceed, isScriptLoaded }, prevState) {
    const { map, isPlacesLoaded } = prevState
    if (!isScriptLoadSucceed && isScriptLoaded) {
      return { mapLoadingFailed: true }
    }

    if (isScriptLoadSucceed && !map) {
      const map = new window.google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: mapCenter,
      })
      return { ...prevState, map, isMapLoaded: true }
    }

    else return null
  }

  fetchPlacesData = () => {
    fetch(FS_API_SEARCH_URL)
      .then(res => res.json())
      .then(data => {
        data.response.venues
        ? this.setState({ places: data.response.venues, isPlacesLoaded: true })
        : this.setState({ placesLoadingFailed: true })
      })
      .catch(error => {
        console.info(error)
      })
  }

  render() {
    const { places, map, mapLoadingFailed, placesLoadingFailed } = this.state
    return (
      <Fragment>
        { mapLoadingFailed
          ? <div role="alert">
              <h2 className="warning">Map Loading Failed</h2>
            </div>
          : <div className="App" role="main">
              <section id="map" ref={this.mapRef} className="map" role="application">
              </section>
            <PlacesList
              places={places}
              map={map}
              fetchFailed={placesLoadingFailed}
            />
            </div>
        }
      </Fragment>
    )
  }
}

export default scriptLoader(
  [`https://maps.googleapis.com/maps/api/js?key=${MAP_API_KEY}`])
  (App)
