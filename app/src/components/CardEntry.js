import React, {useLayoutEffect, useState} from "react";
import BaseEntry from "./BaseEntry.js";
import CopyableInput, {CardInput} from "./CopyableInput.js";
import {authFetch} from "../auth.js";
import {useCookies} from "react-cookie";

const CardEntry = ({cardInfo, devMode, onSave, onDelete}) => {
  const [unsaved, setUnsaved] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCVV] = useState("");
  const [expiration, setExpiration] = useState("");
  const [bank, setBank] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [zip, setZip] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [cookies] = useCookies(["token", "userid"]);

  const init = () => {
    setCardNumber(cardInfo?.cardNumber ?? "");
    setCVV(cardInfo?.cvv ?? "");
    setExpiration(cardInfo?.expiration ?? "");
    setBank(cardInfo?.bank);
    setFirstName(cardInfo?.firstName ?? "");
    setLastName(cardInfo?.lastName ?? "");
    setZip(cardInfo?.zip ?? "");
    setBillingAddress(cardInfo?.billingAddress ?? "");
  }

  // layout effects run before the component's added to DOM
  useLayoutEffect(init, [cardInfo]);

  return (
    <BaseEntry className="card"
      title={bank}
      subtitle={(cardNumber.length > 4 ? "*".repeat(cardNumber.length - 4) : "") + cardNumber.slice(-4)}
      isNew={!cardInfo} isEmpty={!(cardNumber || cvv || expiration || bank || firstName || lastName || zip || billingAddress)}
      editing={unsaved} onEdit={() => setUnsaved(true)} onSave={async () => {
        const newCard = await authFetch(cookies, cardInfo.id ? "/server/card/update/" + cardInfo.id : "/server/card/create", {body: {cardNumber, cvv, expiration, bank, firstName, lastName, zip, billingAddress}},
          devMode, {cardNumber, cvv, expiration, bank, firstName, lastName, zip, billingAddress, id: cardInfo?.id ?? ""+Math.random()}, 1000);
        setUnsaved(false);
        onSave(newCard);
      }}
      onCancel={() => {
        setUnsaved(false);
        init();
      }}
      onDelete={async () => {
        setUnsaved(true);
        if (cardInfo) await authFetch(cookies, "/server/pass/delete/" + cardInfo.id, {body: {}},
          devMode, {}, 1000);
        onDelete();
      }}
    >
      <label>
        Name: <input type="text" required placeholder="Firstname" value={firstName} onChange={e => setFirstName(e.currentTarget.value)} /> <input type="text" required placeholder="Lastname" value={lastName} onChange={e => setLastName(e.currentTarget.value)} />
      </label>
      <label>
        Bank: <input type="text" required value={bank} onChange={e => setBank(e.currentTarget.value)} />
      </label>
      <label>
        Card number: <CardInput text={cardNumber} onChange={setCardNumber} />
      </label>
      <label>
        CVV: <CopyableInput inputMode="numeric" maskable minLength={3} maxLength={3} required text={cvv} onChange={setCVV} />
      </label>
      <label>
        Expiration: <input type="month" required pattern="\d{4}-\d{2}" value={expiration} onChange={e => setExpiration(e.currentTarget.value)} />
      </label>
      <label>
        Billing address: <input type="text" value={billingAddress} onChange={e => setBillingAddress(e.currentTarget.value)} />
        <label>
          Zip: <input type="text" minLength={5} maxLength={5} inputMode="numeric" value={zip} onChange={e => setZip(e.currentTarget.value)} />
        </label>
      </label>
    </BaseEntry>
  );
}

export default CardEntry;
