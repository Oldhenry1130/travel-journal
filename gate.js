(() => {
 'use strict';
 const form=document.getElementById('unlock-form');
 const input=document.getElementById('pin');
 const button=document.getElementById('unlock');
 const status=document.getElementById('status');
 const bytes=value=>Uint8Array.from(atob(value),c=>c.charCodeAt(0));
 let encrypted;
 input.addEventListener('input',()=>{input.removeAttribute('aria-invalid');status.textContent='';});
 form.addEventListener('submit',async event=>{
  event.preventDefault();
  if(button.disabled)return;
  if(!/^[0-9]{4}$/.test(input.value)){status.textContent='請輸入 4 位數 PIN 碼。';input.focus();return;}
  if(!window.crypto?.subtle){status.textContent='此瀏覽器無法解鎖，請使用更新版瀏覽器及 HTTPS 網址。';return;}
  button.disabled=true;input.disabled=true;status.textContent='正在驗證，請稍候…';
  try{
   if(!encrypted){
    const response=await fetch('trip.enc.json',{cache:'no-store'});
    if(!response.ok)throw new Error('load');
    encrypted=await response.json();
    if(encrypted.v!==1||encrypted.kdf!=='PBKDF2-SHA256'||encrypted.cipher!=='AES-256-GCM')throw new Error('load');
   }
   const material=await crypto.subtle.importKey('raw',new TextEncoder().encode(input.value),'PBKDF2',false,['deriveKey']);
   const key=await crypto.subtle.deriveKey({name:'PBKDF2',salt:bytes(encrypted.salt),iterations:encrypted.iterations,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['decrypt']);
   let plain;
   try{plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:bytes(encrypted.iv)},key,bytes(encrypted.data));}
   catch{throw new Error('pin');}
   const html=new TextDecoder('utf-8',{fatal:true}).decode(plain);
   input.value='';
   // The complete journal and its scripts exist only after authenticated decryption.
   document.open();document.write(html);document.close();
  }catch(error){
   if(error.message==='pin'){status.textContent='PIN 碼不正確，請再試一次。';input.setAttribute('aria-invalid','true');}
   else{status.textContent='暫時無法開啟手帳，請確認網路連線後重試。';}
   input.value='';input.disabled=false;button.disabled=false;input.focus();
  }
 });
})();
