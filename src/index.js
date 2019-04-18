import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'

import {HomePage} from "./pages/home/home-page"
import MyAppBar from "./pages/appbar/app-bar"


ReactDOM.render(
	<BrowserRouter>
		<main>
			<MyAppBar />
			<Switch>
				<Route path="/home" component={HomePage}/>

				<Redirect from="*" to="/home"/>
			</Switch>
		</main>
	</BrowserRouter>,
	document.getElementById('root')
);
