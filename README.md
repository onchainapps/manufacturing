![spaceprinter_logo_V1](https://user-images.githubusercontent.com/50184793/158988554-897dfbab-ad58-4957-a183-4a2e8d72c6e9.png)

Space Printer is a linux distribution that runs on a Raspberry Pi and allows you to plug your printer into the Cardano blockchain.
By allowing your 3D printer to part of the Cardano Network and registered with the Adosia market place we are enabling 3D printing manufacturing into peoples houses.

**Videos**
<details>
  <summary><b>Release Videos</b></summary>
  <details>
    <summary><b>V0.6.0-Beta</b></summary>
    How to Upgarde to 0.6.0-Beta<br/>
    https://user-images.githubusercontent.com/50184793/173244042-30b596ab-ef05-4f32-92f3-e29cff4ddd31.mp4
    <br/><br/>
    Extended Video explaining new login Screen.<br/>
    https://user-images.githubusercontent.com/50184793/173454280-80cb56aa-62b4-4cc7-b414-f72816c90a18.mp4
  
  </details>
  
   <details>
    <summary>V0.5.1-Beta</summary>
    
https://user-images.githubusercontent.com/50184793/169188289-c19e733e-f1a3-4497-abae-b7a27b7c6d17.mp4
  </details>
  
  <details>
    <summary>V0.5-Beta</summary>
    
https://user-images.githubusercontent.com/50184793/168614253-6e0efcce-10d7-43b8-96c6-c5ffbbb51bf7.mp4
  </details>
  
  <details>
    <summary>V0.4-Beta</summary>
    
https://user-images.githubusercontent.com/50184793/166256355-32b32606-ce2a-4cf3-9340-5bb910eec5b9.mp4
  </details>
  
</details>

<details>
  <summary><b>Intro Video</b></summary>

  https://user-images.githubusercontent.com/50184793/166168050-70cbcd21-9bfd-4ed2-b2a3-8588f3fef16b.mp4
</details>
 
<details>
  <summary><b>Burning Space Printer Image</b></summary>
  
https://user-images.githubusercontent.com/50184793/166245597-8fbeb16f-7113-405d-8104-c5a7038e3a95.mp4
</details>

<details>
  <summary><b>Headless Setup</b></summary>
  
  https://user-images.githubusercontent.com/50184793/166245424-285ea610-026c-4916-adad-ae24238b94da.mp4
</details>

<details>
  <summary><b>Setting up Printer</b></summary>

https://user-images.githubusercontent.com/50184793/166266598-8e4d21e6-84c6-4fc6-af91-cee692597f3d.mp4
</details>

<details>
  <summary><b>Spaceprinter Wallet Explained</b></summary>

https://user-images.githubusercontent.com/50184793/169544225-3d86764b-713d-4d65-8e0e-546bc578aab0.mp4
</details>

<details>
  <summary><b>Blockfrost VS Cardanobox</b></summary>

https://user-images.githubusercontent.com/50184793/169318248-05739bd3-a60e-42db-9e24-cb3f87fbd868.mp4
</details>

<details>
  <summary><b>Space Printer Updater Client</b></summary>

https://user-images.githubusercontent.com/50184793/169320539-3fb5e658-35b3-4f4c-ab59-2720fd574611.mp4
</details>

<details>
  <summary><b>Submitting Print Jobs</b></summary>
  Coming soon.
</details>

<details>
  <summary><b>Selecting Print Jobs</b></summary>
  Coming soon.
</details>
<hr />

**Reading Material**

<details>
  <summary><b>How this works</b></summary>
  
  Image is based on Ubuntu 22.04.
  <blockquote>
    
  Space Printer firmware brings a frontend dashboard that connects you to the cardano blockchain to access teh Adosia 3d printing smart contract.

  Space printer connects to Cardano blockchain through Cardano Box's hosted node or Blockfrost for those that don't wish to run their own node.

  It utilizes https://open-rpc.org/ to generate and spec out the JSON-RPC 2.0 based backend api and front end client for React.

  The idea of Space Printer dapp is to have it work directly on Raspberry Pi hardware that is connected to your 3D printers serial port.
  Now days most serial ports on 3D printers are emulated through USB.

  Also this takes in mind that you're running a 3D printer that supports Marlin Firmware G-Code commands which is something like 95% of all 3D printers.
  However if you're running a specialty 3D printer and you have serial access to it, we will be more than happy to work with you to support as many 3D     printers out of the box as we can.

  Space Printer needs to be able to access the Cardano blockchain to pull information about print jobs from the Adosia market place smart contracts.
  And to create transactions like minting your registration NFT and accepting print jobs etc etc.

  The dapp/firmware is currently setup to use Blockfrost, for which you can get a free API key that gives you up to 50k requests a day which is MORE       than enough for Space Printer. You will also be able to reuse the API key on more than one device.

  Second solution is running Cardano Box From Adosia. Cardano Box runs tools like Ogmios and Kupo that are hooked up to the Cardano Node directly. If you   have the know how on how to setup Ogmios and Kup and Cardano-node on your own hardware you can point Space Printer towards that as well.
  </blockquote>
</details>

<details>
  <summary><b>Whats What</b></summary>
  
  <blockquote>
    **Server directory** contains the backend api source code the JSON-RPC 2.0<br/>
    **Client directory** contains a reactjs client with auto compelte and everyting for the above api.<br/>
    </blockquote>
</details>

<details>
  <summary><b>Materials</b></summary>
  
<blockquote> 
Currently Space Printer is supported on all Raspberry PI3 and above. You can atually burn the image onto a SD Card or USB Drive and switch it on the go between different Raspberry Pis.

Few things to keep in mind. Using certain Raspberry Pi's come with certian restrictions outlined below:
  
**SD Cards**: Even though this image is supported on SD Cards and using certain Raspberry Pi models will give you no choice but to use a SD Card. I am not a SD Card fan, they're not too reliable and painfully slow but get the job done most of the time. However as long as you save your printer seed phrases.
due to decentralization and data being stored on the Cardano network recovering from a crashed SD card or system in general is rather painless.
  
**Slicer**: Space Printer has the capability to run Kiri:Moto Slicer locally, but it won't let you set it up unless you're using a device with 2Gb or more.
  
**Raspberry Pi 3A+**: This is a great little 512Ram Quad Corce devvice wtih build in WiFi, SD Card port and 1xUSB2.0 port. Using this device you will need to setup a file with your WiFi credentials describe int he instructions and you can only use an SD card do to it only hacing one USB port which use going to be use to plug into your 3D printer.
  
**Raspberry Pi 3B+**: This is by far my favorite model and I still have one I bought 5 years ago. These come with 1Gb Ram, Quad 64Bit core, 4 USB ports and ethernet port. Due to the fact that you can plug this one up to your network directly it makes it somewhat easier to do first time setup after burning and running your image.

**Raspberry Pi 4B+** Much like the 3B+ any range from 1Gb to 8Gb of these will work these are excellent SBCs.
  
**Power Supplies** Buy a Raspberry Pi certified power supply, simple Amazon or Google search will turn up several I like using this power supply beccause it comes with plugs for most countries: https://www.amazon.com/gp/product/B07VNQ3YHG/ref=ppx_yo_dt_b_asin_title_o02_s00?ie=UTF8&psc=1
  
**Ethernet** Normal ethernet CAT5 and higher cable if you don't want to use WiFi setup.

**USB** Your 3D printer should have come with a USB cable to connect to your computer, if it didn't check what type of USB port your printer has and get one.

</blockquote>
</details>

<details>
  <summary><b>SSH Instructions</b></summary>
  
<blockquote>
  **SSH Credentials**
  username: printer
  password: spaceprinter
    
  First boot up will take longer. Due to expanding into the full size of your medium.
  And running some first time scripts. The first bootup time will also depend on the Raspberry Pi that you use.
  
  1) I would recommend SSH into the device and changing the password with the `passwd` command.
  
  2) You can setup your Wifi and Blockfrost API key headlesly by following the instrctions in the "Headless Setup" video above.
</blockquote>
</details>

<details>
  <summary><b>Using Space Printer</b></summary>
  
<blockquote>
  Keep in mind the Space Printer dapp is still in very early Development Beta stages.
  
  Once you have your Raspberry Pi running with the Space Printer firmware and connected to your network. You should be able to open up any web browser      and type in `http://spaceprinter.local` in the address bar and it should bring up the Space Printer UI.

  From there you can select your session type, meaning how is the dapp accessing the Cardano Blockchain as explained above, you can choose `Blockfrost`     or `Cardano Box`.

  Choosing the Blockfrost option will require you to create a local account on your device and obtain a blockfrost API key.
  
  Choosing the Cardano Box option will only require you to login with the same account you have existing on your Cardano Box.
  
  If for some reason you're getting Auth Errors or no account on either solution and you can't remember your passwords. You can use the WIPE db solution,   keep in mind this will also wipe any wallet information you had on the device. However you can easily recover your wallets with your seed phrase and     all the data will resync from the Cardano Blockchain (FUCK YEAH DECENTRALIZATION)!!!
  
  Next step is to setup your printer wallet with one of two options, generate a new one or recover from seed phrase. Either option you chose you will       need to have your Space Printer device connected to your printer via USB and make sure it has a serial connection.
  
  Once your wallet is setup you will need to make sure it's funded with enough ADA to complete registration transactions if it's a new wallet and to pick   up new print jobs or complete current ones.
</blockquote>
</details>
