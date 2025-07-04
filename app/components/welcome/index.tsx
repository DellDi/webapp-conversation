"use client";
import type { FC } from "react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import TemplateVarPanel, { PanelTitle, VarOpBtnGroup } from "../value-panel";
import FileUploaderInAttachmentWrapper from '../base/file-uploader-in-attachment'
import s from "./style.module.css";
import {
  AppInfoComp,
  ChatBtn,
  EditBtn,
  PromptTemplate,
} from "./massive-component";
import type { AppInfo, PromptConfig } from "@/types/app";
import Toast from "@/app/components/base/toast";
import Select from "@/app/components/base/select";
import { DEFAULT_VALUE_MAX_LEN } from "@/config";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { getCustomUrlParams } from "@/utils/string";
import { useTranslationName } from "@/utils";

// regex to match the {{}} and replace it with a span
const regex = /\{\{([^}]+)}}/g;

export type IWelcomeProps = {
  conversationName: string;
  hasSetInputs: boolean;
  isPublicVersion: boolean;
  onShowSideBar?: () => void;
  siteInfo: AppInfo;
  promptConfig: PromptConfig;
  onStartChat: (inputs: Record<string, any>) => void;
  canEditInputs: boolean;
  savedInputs: Record<string, any>;
  onInputsChange: (inputs: Record<string, any>) => void;
};

const Welcome: FC<IWelcomeProps> = ({
  conversationName,
  hasSetInputs,
  isPublicVersion,
  siteInfo,
  promptConfig,
  onShowSideBar,
  onStartChat,
  canEditInputs,
  savedInputs,
  onInputsChange,
}): JSX.Element => {
  const { userName } = getCustomUrlParams();
  const translateName = useTranslationName();

  const { t } = useTranslation();
  const hasVar = promptConfig.prompt_variables.length > 0;
  const [isFold, setIsFold] = useState<boolean>(true);
  const [inputs, setInputs] = useState<Record<string, any>>(
    (() => {
      if (hasSetInputs) return savedInputs;
      const res: Record<string, any> = {};
      if (promptConfig) {
        promptConfig.prompt_variables.forEach((item) => {
          res[item.key] = userName;
        });
      }
      return res;
    })()
  );

  const [needsClick, setNeedsClick] = useState(false);

  useEffect(() => {
    if (!savedInputs) {
      const res: Record<string, any> = {};
      if (promptConfig) {
        promptConfig.prompt_variables.forEach((item) => {
          res[item.key] = userName;
        });
      }
      setInputs(res);
      setNeedsClick(true);
    } else {
      setInputs(savedInputs);
    }
  }, [savedInputs]);

  const { notify } = Toast;
  const logError = (message: string) => {
    notify({ type: "error", message, duration: 3000 });
  };

  const canChat = () => {
    const inputLens = Object.values(inputs).length;
    const promptVariablesLens = promptConfig.prompt_variables.length;
    const emptyInput =
      inputLens < promptVariablesLens ||
      Object.values(inputs).filter((v) => v === "").length > 0;
    if (emptyInput) {
      logError(t("app.errorMessage.valueOfVarRequired"));
      return false;
    }
    return true;
  };

  const handleChat = () => {
    if (!canChat()) return;
    onStartChat(inputs);
  };

  useEffect(() => {
    if (needsClick) {
      handleChat();
      setNeedsClick(false);
    }
  }, [needsClick]); // 依赖项列表中只有inputs

  const highLightPromoptTemplate = (() => {
    if (!promptConfig) return "";
    return promptConfig.prompt_template.replace(regex, (match, p1) => {
      return `<span class='text-gray-800 font-bold'>${
        inputs?.[p1] ? inputs?.[p1] : match
      }</span>`;
    });
  })();

  const renderHeader = (): JSX.Element | null => {
    if (isPublicVersion) return null;
    const handleSidebarClick = (): void => {
      if (onShowSideBar) onShowSideBar();
    };

    const handleEditClick = (): void => {
      // TODO: Implement edit functionality
      console.log('Edit button clicked');
    };

    return (
      <div className="absolute left-0 top-0 right-0 flex items-center justify-between border-b border-gray-100 mobile:h-14 tablet:h-[52px] px-4">
        <div className="text-gray-900">{translateName(conversationName)}</div>
        <div className="flex items-center">
          <div className="flex items-center px-1">
            <EditBtn onClick={handleEditClick} />
          </div>
          <div className="flex items-center px-1">
            <Bars3Icon
              className="w-4 h-4 text-gray-500 cursor-pointer"
              onClick={handleSidebarClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleSidebarClick()}
            />
          </div>
        </div>
      </div>
    );
  };
  const renderInputs = () => {
    return (
      <div className="space-y-3">
        {promptConfig.prompt_variables.map((item) => (
          <div
            className="tablet:flex items-start mobile:space-y-2 tablet:space-y-0 mobile:text-xs tablet:text-sm"
            key={item.key}
          >
            <label
              className={`flex-shrink-0 flex items-center tablet:leading-9 mobile:text-gray-700 tablet:text-gray-900 mobile:font-medium pc:font-normal ${s.formLabel}`}
            >
              {item.name}
            </label>
            {item.type === "select" && (
              <Select
                className="w-full"
                defaultValue={inputs?.[item.key]}
                onSelect={(i) => {
                  setInputs({ ...inputs, [item.key]: i.value });
                }}
                items={(item.options || []).map((i) => ({ name: i, value: i }))}
                allowSearch={false}
                bgClassName="bg-gray-50"
              />
            )}
            {item.type === "string" && (
              <input
                placeholder={`${item.name}${
                  !item.required
                    ? `(${t("appDebug.variableTable.optional")})`
                    : ""
                }`}
                value={inputs?.[item.key] || ""}
                onChange={(e) => {
                  setInputs({ ...inputs, [item.key]: e.target.value });
                }}
                className={
                  "w-full flex-grow py-2 pl-3 pr-3 box-border rounded-lg bg-gray-50"
                }
                maxLength={item.max_length || DEFAULT_VALUE_MAX_LEN}
              />
            )}
            {item.type === "paragraph" && (
              <textarea
                className="w-full h-[104px] flex-grow py-2 pl-3 pr-3 box-border rounded-lg bg-gray-50"
                placeholder={`${item.name}${
                  !item.required
                    ? `(${t("appDebug.variableTable.optional")})`
                    : ""
                }`}
                value={inputs?.[item.key] || ""}
                onChange={(e) => {
                  setInputs({ ...inputs, [item.key]: e.target.value });
                }}
              />
            )}

            {
              item.type === 'file' && (
                <FileUploaderInAttachmentWrapper
                  fileConfig={{
                    allowed_file_types: item.allowed_file_types,
                    allowed_file_extensions: item.allowed_file_extensions,
                    allowed_file_upload_methods: item.allowed_file_upload_methods!,
                    number_limits: 1,
                    fileUploadConfig: {} as any,
                  }}
                  onChange={(files) => {
                    setInputs({ ...inputs, [item.key]: files[0] })
                  }}
                  value={inputs?.[item.key] || []}
                />
              )
            }
            {
              item.type === 'file-list' && (
                <FileUploaderInAttachmentWrapper
                  fileConfig={{
                    allowed_file_types: item.allowed_file_types,
                    allowed_file_extensions: item.allowed_file_extensions,
                    allowed_file_upload_methods: item.allowed_file_upload_methods!,
                    number_limits: item.max_length,
                    fileUploadConfig: {} as any,
                  }}
                  onChange={(files) => {
                    setInputs({ ...inputs, [item.key]: files })
                  }}
                  value={inputs?.[item.key] || []}
                />
              )
            }
          </div>
        ))}
      </div>
    );
  };

  const renderNoVarPanel = () => {
    if (isPublicVersion) {
      return (
        <div>
          <AppInfoComp siteInfo={siteInfo} />
          <TemplateVarPanel
            isFold={false}
            header={
              <>
                <PanelTitle
                  title={t("app.chat.publicPromptConfigTitle")}
                  className="mb-1"
                />
                <PromptTemplate html={highLightPromoptTemplate} />
              </>
            }
          >
            <ChatBtn onClick={handleChat} />
          </TemplateVarPanel>
        </div>
      );
    }
    // private version
    return (
      <TemplateVarPanel
        isFold={false}
        header={<AppInfoComp siteInfo={siteInfo} />}
      >
        <ChatBtn onClick={handleChat} />
      </TemplateVarPanel>
    );
  };

  const renderVarPanel = () => {
    return (
      <TemplateVarPanel
        isFold={false}
        header={<AppInfoComp siteInfo={siteInfo} />}
      >
        {renderInputs()}
        <ChatBtn
          className="mt-3 mobile:ml-0 tablet:ml-[128px]"
          onClick={handleChat}
        />
      </TemplateVarPanel>
    );
  };

  const renderVarOpBtnGroup = () => {
    return (
      <VarOpBtnGroup
        onConfirm={() => {
          if (!canChat()) return;

          onInputsChange(inputs);
          setIsFold(true);
        }}
        onCancel={() => {
          setInputs(savedInputs);
          setIsFold(true);
        }}
      />
    );
  };

  const renderHasSetInputsPublic = () => {
    if (!canEditInputs) {
      return (
        <TemplateVarPanel
          isFold={false}
          header={
            <>
              <PanelTitle
                title={t("app.chat.publicPromptConfigTitle")}
                className="mb-1"
              />
              <PromptTemplate html={highLightPromoptTemplate} />
            </>
          }
        />
      );
    }

    return (
      <TemplateVarPanel
        isFold={isFold}
        header={
          <>
            <PanelTitle
              title={t("app.chat.publicPromptConfigTitle")}
              className="mb-1"
            />
            <PromptTemplate html={highLightPromoptTemplate} />
            {isFold && (
              <div className="flex items-center justify-between mt-3 border-t border-indigo-100 pt-4 text-xs text-indigo-600">
                <span className="text-gray-700">
                  {t("app.chat.configStatusDes")}
                </span>
                <EditBtn onClick={() => setIsFold(false)} />
              </div>
            )}
          </>
        }
      >
        {renderInputs()}
        {renderVarOpBtnGroup()}
      </TemplateVarPanel>
    );
  };

  const renderHasSetInputsPrivate = () => {
    if (!canEditInputs || !hasVar) return null;

    return (
      <TemplateVarPanel
        isFold={isFold}
        header={
          <div className="flex items-center justify-between text-indigo-600">
            <PanelTitle
              title={
                !isFold
                  ? t("app.chat.privatePromptConfigTitle")
                  : t("app.chat.configStatusDes")
              }
            />
            {isFold && <EditBtn onClick={() => setIsFold(false)} />}
          </div>
        }
      >
        {renderInputs()}
        {renderVarOpBtnGroup()}
      </TemplateVarPanel>
    );
  };

  const renderHasSetInputs = (): JSX.Element | null => {
    if ((!isPublicVersion && !canEditInputs) || !hasVar) return null;

    return (
      <div className="pt-[10px] mb-5">
        {isPublicVersion
          ? renderHasSetInputsPublic()
          : renderHasSetInputsPrivate()}
      </div>
    );
  };

  return (
    <div className="relative mobile:min-h-[48px] tablet:min-h-[64px]">
      {hasSetInputs && renderHeader()}
      <div className="mx-auto pc:w-[794px] max-w-full mobile:w-full px-3.5">
        {/*  Has't set inputs  */}
        {!hasSetInputs && (
          <div className="mobile:pt-[72px] tablet:pt-[128px] pc:pt-[200px]">
            {hasVar ? renderVarPanel() : renderNoVarPanel()}
          </div>
        )}

        {/* Has set inputs */}
        {/* {hasSetInputs && renderHasSetInputs()} */}

        {/* foot */}
        {!hasSetInputs && (
          <div className="mt-4 flex justify-between items-center h-8 text-xs text-gray-400">
            {siteInfo.privacy_policy ? (
              <div>
                {t("app.chat.privacyPolicyLeft")}
                <a
                  className="text-gray-500"
                  href={siteInfo.privacy_policy}
                  target="_blank"
                >
                  {t("app.chat.privacyPolicyMiddle")}
                </a>
                {t("app.chat.privacyPolicyRight")}
              </div>
            ) : (
              <div></div>
            )}
            {/* <a className='flex items-center pr-3 space-x-3' href="https://dify.ai/" target="_blank">
              <span className='uppercase'>{t('app.chat.powerBy')}</span>
              <FootLogo />
            </a> */}
          </div>
        )}
      </div>
    </div>
  );
};

const MemoizedWelcome = React.memo(Welcome);
MemoizedWelcome.displayName = 'Welcome';

export default MemoizedWelcome;
