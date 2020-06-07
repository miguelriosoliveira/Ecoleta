import React from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';

import CreatePoint from './pages/CreatePoint';
import Home from './pages/Home';

const Routes: React.FC = () => {
	return (
		<BrowserRouter>
			<Switch>
				<Route exact path="/" component={Home} />
				<Route path="/create-point" component={CreatePoint} />
			</Switch>
		</BrowserRouter>
	);
};

export default Routes;
