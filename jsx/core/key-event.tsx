import * as React from 'react';
// key eventを感知
import * as keyLogics from '../../logics/key';

interface IPropKeyEvents{
}
export default class KeyEvents extends React.Component<IPropKeyEvents, {}>{
    constructor(props: IPropKeyEvents){
        super(props);

        this.keydownHandler = this.keydownHandler.bind(this);
    }
    private keydownHandler(e: KeyboardEvent){
        const mv = keyLogics.runByKey({
            key: e.key,
            shift: e.shiftKey,
            ctrl: e.ctrlKey,
            alt: e.altKey,
        });
        if (mv){
            e.preventDefault();
        }
    }
    componentDidMount(){
        document.addEventListener('keydown', this.keydownHandler, false);
    }
    componentWillUnmount(){
        document.removeEventListener('keydown', this.keydownHandler, false);
    }
    render(){
        return <div/>;
    }
}
