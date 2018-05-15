import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Document } from '@mongodb-js/compass-crud';
import { TextButton } from 'hadron-react-buttons';
import HadronDocument from 'hadron-document';
import LoadingOverlay from 'components/loading-overlay';
import { OUT } from 'modules/pipeline';
import classnames from 'classnames';

import styles from './stage-preview.less';

/**
 * The stage preview component.
 */
class StagePreview extends Component {
  static displayName = 'StagePreview';

  static propTypes = {
    documents: PropTypes.array.isRequired,
    isValid: PropTypes.bool.isRequired,
    isEnabled: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    stageOperator: PropTypes.string,
    stageValue: PropTypes.any
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.isLoading !== this.props.isLoading ||
      nextProps.isEnabled !== this.props.isEnabled ||
      nextProps.stageOperator === OUT ||
      nextProps.documents.length !== this.props.documents.length;
  }

  renderPreview() {
    if (this.props.isValid && this.props.isEnabled) {
      if (this.props.stageOperator === OUT) {
        return (
          <div className={classnames(styles['stage-preview-out'])}>
            <div className={classnames(styles['stage-preview-out-text'])}>
              The $out operator will persist the results of the pipeline
              to the specified collection. Please confirm to execute.
            </div>
            <div className={classnames(styles['stage-preview-out-button'])}>
              <TextButton
                text="Save Documents"
                className="btn btn-xs btn-primary"
                clickHandler={null} />
            </div>
          </div>
        );
      }
      if (this.props.documents.length > 0) {
        const documents = this.props.documents.map((doc, i) => {
          return (<Document doc={new HadronDocument(doc)} editable={false} key={i} />);
        });
        return (
          <div className={classnames(styles['stage-preview-documents'])}>
            {documents}
          </div>
        );
      }
    }
    return (
      <div className={classnames(styles['stage-preview-invalid'])}>
        <i>No Preview Documents</i>
      </div>
    );
  }

  renderLoading() {
    if (this.props.isLoading) {
      if (this.props.stageOperator === OUT) {
        return (<LoadingOverlay text="Persisting Documents..." />);
      }
      return (<LoadingOverlay text="Loading Preview Documents..." />);
    }
  }

  /**
   * Renders the stage preview.
   *
   * @returns {React.Component} The component.
   */
  render() {
    return (
      <div className={classnames(styles['stage-preview'])}>
        {this.renderLoading()}
        {this.renderPreview()}
      </div>
    );
  }
}

export default StagePreview;
