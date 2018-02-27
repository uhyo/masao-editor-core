import MasaoEditorCore from './core/index';

import { MapState } from '../stores/map';
import { ParamsState } from '../stores/params';
import { EditState } from '../stores/edit';
import { ProjectState } from '../stores/project';

import Button from './core/util/button';
import Select from './core/util/select';
import Switch from './core/util/switch';

import {
    Command,
    commandNames,
    ExternalCommand,
} from '../logics/command';

export const uis = {
    Button,
    Select,
    Switch,
};

export {
    MapState,
    ParamsState,
    EditState,
    ProjectState,

    Command,
    ExternalCommand,
    commandNames,
};

export default MasaoEditorCore;
