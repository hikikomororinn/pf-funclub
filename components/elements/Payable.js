import { useState, useEffect } from "react";
import { firestore }           from "../../lib/db";

function Payable(props) {
  // use hooks
  const [source, setSource] = useState({ key: "card", last4: "0000" });
  const [sources, setSources] = useState([
    { key: "dummy", last4: "choose payment card" }
  ]);

  // useEffect like componetDidMount
  useEffect(() => {
    firestore
      .collection("stripe_customers")
      .doc(props.currentUid)
      .collection("sources")
      .onSnapshot(
        snapshot => {
          let newSources = [];
          snapshot.forEach(doc => {
            newSources.push({ key: doc.data().id, last4: doc.data().last4 });
          });
          if(newSources.length != 0) {
          setSources(newSources);
          setSource(newSources[0]);
          }
        },
        () => {
          const state = Object.assign(sources, {
            sources: []
          });
          setSources(state);
        }
      );
  }, [props.currentUid]);

  const handleCharge = event => {
    event.preventDefault();
    alert(
      `${source.last4}(${source.key})で${props.detail.monthlyFee}円はらいます。手続き完了までしばらくかかります。`
    );
    firestore
      .collection("stripe_customers")
      .doc(props.currentUid)
      .collection("charges")
      .add({
        source: source.key,
        amount: parseInt(props.detail.monthlyFee),
        plan: props.detail.plan,
        fanpageId: props.detail.id
      });
  };

  const handleChange = event => {
    const currentSource = sources.find(
      source => source.key === event.target.value
    );
    setSource(currentSource);
  };
  return (
    <>
      <form onSubmit={handleCharge}>
        <select value={source.key} onChange={handleChange}>
          {sources.map(value => {
            return (
              <option key={value.key} value={value.key}>
                {value.last4}
              </option>
            );
          })}
        </select>
        <button type="submit">Buy Now</button>
      </form>
    </>
  );
}

export default Payable;