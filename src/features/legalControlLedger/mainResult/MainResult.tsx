import React from "react";
import { useAppSelector } from "../../../app/hooks";
import { messageTextData } from "../messageSlice";


//stateの処理結果メッセージを画面に表示する処理
const MainResult: React.FC = () => {
//Selectorを使ってstateの処理結果メッセージを取得し、変数に格納する
const message = useAppSelector(messageTextData);


//処理結果メッセージの内容の内容によるswith文で条件分岐して
//変数resultMessageに処理結果メッセージとメッセージ内容に応じたタグを組み合わせて格納
let resultMessageHtml;

switch (message.messageText) {
  case "正常に追加されました":
      resultMessageHtml = <strong>{message.messageText}</strong>;
      break;
  case "追加しようとしたidが重複しています":
      resultMessageHtml = <strong className='text-danger'>{message.messageText}</strong>;
      break;
  case "削除が完了しました":
      resultMessageHtml = <strong>{message.messageText}</strong>;
      break;
  case "削除対象が存在しません":
      resultMessageHtml = <strong className='text-danger'>{message.messageText}</strong>;
      break;
  case "更新が完了しました":
      resultMessageHtml = <strong>{message.messageText}</strong>;
      break;
  default:
      resultMessageHtml = <strong className='text-danger'>{message.messageText}</strong>;
}

//resultMessageHtmlにタグ<div className = "text-left">を付加してreturnする
return <div className="texlt-left">{resultMessageHtml}</div>

};

export default MainResult;