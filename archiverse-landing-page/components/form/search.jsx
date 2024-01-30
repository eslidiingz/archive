function Search(props) {

	return (
		<>
			{( props.filter ) && 
				<div className={`${props.className}`}>
					<div className="position-relative">
						<input placeholder="Search"
							className="form-control search input-search-set"
							name={props.name} value={ props.filter[props.name] }
							onChange={(e) => { props.handleFilterChange(e) }}
						/>
						{/* <i className="fas fa-search icon-search text-white"></i> */}
					</div>
				</div>
			}
		</>
	)
  }
  export default Search
  