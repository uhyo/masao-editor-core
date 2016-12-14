import * as React from 'react';
import * as ReactDOM from 'react-dom';

import MasaoEditor from './front/index';

const id = 'app';

document.addEventListener('DOMContentLoaded', ()=>{
    const apparea = document.getElementById(id);

    const root = <MasaoEditor/>;

    ReactDOM.render(root, apparea);
});
