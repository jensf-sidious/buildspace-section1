import { Component, OnInit } from '@angular/core';
import { ethers } from 'ethers';
import { from, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import wavePortalAbi from 'src/assets/abi/WavePortal.json';

declare let window: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'waveportal-ng';

  ngOnInit(): void {
    this.checkIfWalletIsConnected();
  }

  // Connect button
  connectWallet() {
    try {
      const ethereum = window.ethereum;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      from(ethereum.request({ method: "eth_requestAccounts" })).pipe(
        take(1)).subscribe(accounts => console.log(accounts[0]));
    } catch (error) {
      console.log(error);
    }
  }  

  wave() {
    try {
      const ethereum = window.ethereum;
      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        console.log('Provider: ', provider);
        const signer = provider.getSigner();
        console.log('Signer: ', signer);
        const WavePortalContract:any = new ethers.Contract(
          environment.contractAddress, wavePortalAbi.abi, signer);
        console.log('Contract: ', WavePortalContract);
        from(WavePortalContract.getTotalWaves()).subscribe(count => {
          console.log("Retrieved total wave count: ", count);
        });
      } else {
        console.log('Ethereum object does not exist!');
      }
    } catch (error) {
      console.log(error)
    }
  }

  private checkIfWalletIsConnected() {
    try {
      // Get's injected by metamask
      const ethereum = window.ethereum;
      if (!ethereum) {
        console.log("Make sure you have metamask!");
      } else {
        console.log("We have the ethereum object ", ethereum);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
