import React, {useState} from "react";
import BaseEntry from "./BaseEntry.js";
import EntryCell, {CreditCardEntryCell} from "./EntryCell.js";

const CreditCardEntry = ({cardInfo}) => {
  const [editable, setEditable] = useState(false);
  const [cardNumber, setCardNumber] = useState(cardInfo.cardNumber ?? "");
  const [cvv, setCVV] = useState(cardInfo.cvv ?? "");
  const [expiration, setExpiration] = useState(cardInfo.expiration ?? "");
  const [bank, setBank] = useState(cardInfo.bank ?? "");
  const [firstName, setFirstName] = useState(cardInfo.firstName ?? "");
  const [lastName, setLastName] = useState(cardInfo.lastName ?? "");
  const [zip, setZip] = useState(cardInfo.zip ?? "");
  const [billingAddress, setBillingAddress] = useState(cardInfo.billingAddress ?? "");

  return (
    <BaseEntry className="card"
      editing={editable} onEdit={() => setEditable(true)} onSave={() => {
        setEditable(false);
        // TODO
      }}
      onCancel={() => {
        setEditable(false);
        setCardNumber(cardInfo.cardNumber); setCVV(cardInfo.cvv); setExpiration(cardInfo.expiration); setBank(cardInfo.bank); setFirstName(cardInfo.firstName); setLastName(cardInfo.lastName); setZip(cardInfo.zip); setBillingAddress(cardInfo.billingAddress);
      }}
      heading={<>
        <EntryCell text={bank} onChange={setBank} disabled={!editable} />
        <CreditCardEntryCell text={cardNumber} onChange={setCardNumber} disabled={!editable} />
      </>}
    >
      {JSON.stringify(cardInfo)}
      <label>
        Name: <input type="text" required placeholder="Firstname" value={firstName} onChange={e => setFirstName(e.currentTarget.value)} disabled={!editable} /> <input type="text" required placeholder="Lastname" value={lastName} onChange={e => setLastName(e.currentTarget.value)} disabled={!editable} />
      </label>
      <label>
        CVV: <input type="password" inputMode="numeric" minLength={3} maxLength={3} required value={cvv} onChange={e => setCVV(e.currentTarget.value)} disabled={!editable} />
      </label>
      <label>
        Expiration: <input type="month" required value={expiration} onChange={e => setExpiration(e.currentTarget.value)} disabled={!editable} />
      </label>
      <label>
        Billing address: <input type="text" value={billingAddress} onChange={e => setBillingAddress(e.currentTarget.value)} disabled={!editable} />
        <label>
          Zip: <input type="text" minLength={5} maxLength={5} inputMode="numeric" value={zip} onChange={e => setZip(e.currentTarget.value)} disabled={!editable} />
        </label>
      </label>
    </BaseEntry>
  );
}

export default CreditCardEntry;
