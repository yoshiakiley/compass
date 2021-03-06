import "./add-namespace-dialog.scss"

import React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { t, Trans } from "@lingui/macro";
import { _i18n } from "../../i18n";
import { Dialog, DialogProps } from "../dialog";
import { Wizard, WizardStep } from "../wizard";
import { namespaceStore } from "./namespace.store";
import { Namespace, namespacesApi } from "../../api/endpoints";
import { Input } from "../input";
import { systemName } from "../input/input.validators";
import { Notifications } from "../notifications";

interface Props extends DialogProps {
  onSuccess?(ns: Namespace): void;
  onError?(error: any): void;
}

@observer
export class AddNamespaceDialog extends React.Component<Props> {
  @observable static isOpen = false;
  @observable namespace = "";

  static open() {
    AddNamespaceDialog.isOpen = true;
  }

  static close() {
    AddNamespaceDialog.isOpen = false;
  }

  close = () => {
    AddNamespaceDialog.close();
  }

  addNamespace = async () => {
    const { namespace } = this;
    await namespacesApi.create({ name: namespace, namespace: "" }).
      then((v) => {
        Notifications.ok(<>Namespace {namespace} save succeeded</>);
      }).catch((err) => {
        Notifications.error(err);
      }).finally(() => {
        this.close();
      })
  }

  render() {
    const { ...dialogProps } = this.props;
    const { namespace } = this;
    const header = <h5><Trans>Create Namespace</Trans></h5>;
    return (
      <Dialog
        {...dialogProps}
        className="AddNamespaceDialog"
        isOpen={AddNamespaceDialog.isOpen}
        close={this.close}
      >
        <Wizard header={header} done={this.close}>
          <WizardStep
            contentClass="flex gaps column"
            nextLabel={<Trans>Create</Trans>}
            next={this.addNamespace}
          >
            <Input
              required autoFocus
              iconleft="layers"
              placeholder={_i18n._(t`Namespace`)}
              validators={systemName}
              value={namespace} onChange={v => this.namespace = v.toLowerCase()}
            />
          </WizardStep>
        </Wizard>
      </Dialog>
    )
  }
}
