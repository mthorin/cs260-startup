import React from 'react';

export function Players(props) {
    const [userWin, setUserWin] = React.useState(0);
    const [userLoss, setUserLoss] = React.useState(0);
    const [oppWin, setOppWin] = React.useState(0);
    const [oppLoss, setOppLoss] = React.useState(0);

    async function getWinLoss(username){
        let wlratio = [];
        try {
          const response = await fetch('/api/user/wlratio/' + username);
          wlratio = await response.json();
        } catch (e) {
          console.log(e);
          wlratio = [0,0];
        }
        return wlratio;
      }

    React.useEffect(() => {
        getWinLoss(localStorage.getItem('userName'))
        .then((wl) => {
            setUserWin(wl[0]);
            setUserLoss(wl[1]);
        })
        getWinLoss(props.opp)
        .then((wl) => {
            setOppWin(wl[0]);
            setOppLoss(wl[1]);
        })
    }, []);

    return (
        <>
            <h1 className="players">{localStorage.getItem('userName')} vs. {props.opp}</h1>
            <h1 className="wlratio">{userWin}-{userLoss}    {oppWin}-{oppLoss}</h1>
        </>
    );
}