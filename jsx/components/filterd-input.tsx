import * as React from 'react';

export type IPropFilteredInput = Pick<
  React.InputHTMLAttributes<HTMLInputElement>,
  Exclude<keyof React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>
> & {
  filter: (value: string) => boolean;
  onChange?: (value: string) => void;
};
export interface IStateFilteredInput {
  value: string;
}
/**
 * Semi-controlled input which filters invalid input.
 */
export class FilteredInput extends React.PureComponent<
  IPropFilteredInput,
  IStateFilteredInput
> {
  private inputRef = React.createRef<HTMLInputElement>();
  constructor(props: IPropFilteredInput) {
    super(props);
    this.changeHandler = this.changeHandler.bind(this);

    this.state = { value: '' };
  }
  static getDerivedStateFromProps(
    props: IPropFilteredInput,
  ): IStateFilteredInput {
    return {
      value: props.value as string,
    };
  }
  public render() {
    const { filter, onChange: _1, value, ...props } = this.props;
    return <input ref={this.inputRef} {...props} />;
  }
  public componentDidMount() {
    const { current: input } = this.inputRef;
    if (input == null) {
      return;
    }
    input.value = String(this.props.value);
    input.addEventListener('input', this.changeHandler, false);
  }
  public componentWillUnmount() {
    const { current: input } = this.inputRef;
    if (input == null) {
      return;
    }
    input.removeEventListener('input', this.changeHandler, false);
  }
  public componentDidUpdate() {
    // If props.value is updated, set to the input.
    const { current: input } = this.inputRef;
    if (input == null) {
      return;
    }
    input.value = String(this.props.value);
  }
  private changeHandler(e: Event): void {
    const { filter, onChange } = this.props;
    const { currentTarget } = e;
    const inputValue = (currentTarget as any).value;

    if (onChange != null && filter(inputValue)) {
      // This value is accepted.
      onChange(inputValue);
    }
  }
}
