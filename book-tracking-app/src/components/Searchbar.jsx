import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { debounce } from 'lodash'

export default class Searcbar extends Component {
  state = {
    value: '',
  }

  startFetch = debounce((value) => {
    this.props.searchBooks(value)
  }, 700)

  handleChange = (event) => {
    const { value } = event.target
    this.setState({ value })
    if (value) this.startFetch(value);
  }

  handleSubmit = (event) => {
    event.preventDefault()
    this.props.searchBooks(this.state.value)
    this.setState({ value: '' })
  }

  render() {
    const placeholder = this.props.isFetching
      ? 'Fetching data...'
      : 'Search by title or author'
    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link
            className="close-search"
            onClick={this.handleBack}
            to="/"
          />
          <form
            className="search-books-input-wrapper"
            onSubmit={this.handleSubmit}
          >
            <input
              type="text"
              placeholder={placeholder}
              onChange={this.handleChange}
              value={this.state.value}
              required
            />
          </form>
        </div>
      </div>
    )
  }
}
