import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SortOption } from '../../types';
import {
  Settings,
  Volume2,
  VolumeX,
  Sparkles,
  Download,
  Upload,
  RotateCcw,
  Palette,
  Check,
  Plus,
  Trash2,
  ShieldAlert,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

export const SettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    profile,
    updateNickname,
    categories,
    addCategory,
    exportDataJson,
    importDataJson,
    resetAllData,
  } = useApp();

  const [nick, setNick] = useState(profile.nickname);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('✨');
  const [newCatColor, setNewCatColor] = useState('#F472B6');
  const [importText, setImportText] = useState('');
  const [showImportArea, setShowImportArea] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (nick.trim()) {
      updateNickname(nick.trim());
      soundManager.playClick();
      alert('프로필 닉네임이 성공적으로 저장되었습니다! 🐰');
    }
  };

  const handleExport = () => {
    soundManager.playClick();
    const jsonStr = exportDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `work-quest-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = () => {
    if (!importText.trim()) return;
    const success = importDataJson(importText.trim());
    if (success) {
      soundManager.playLevelUp();
      alert('데이터 복원이 성공적으로 완료되었습니다! 🎉');
      setShowImportArea(false);
      setImportText('');
    } else {
      alert('유효하지 않은 JSON 데이터입니다. 백업 파일을 확인해주세요.');
    }
  };

  const handleReset = () => {
    if (
      window.confirm(
        '⚠️ 경고: 모든 퀘스트, 레벨, 통계, 커스터마이징 데이터가 초기화됩니다. 계속하시겠습니까?'
      )
    ) {
      resetAllData();
      alert('모든 데이터가 초기 설정으로 리셋되었습니다.');
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    addCategory({
      name: newCatName.trim(),
      icon: newCatIcon,
      color: newCatColor,
      badgeBg: 'bg-pink-100',
      badgeText: 'text-pink-700',
    });

    setNewCatName('');
    soundManager.playClick();
  };

  return (
    <div className="space-y-4 max-w-4xl">
      {/* Top Banner */}
      <div className="pixel-box p-4 bg-gradient-to-r from-slate-100 via-pink-50 to-purple-50 flex items-center gap-3">
        <span className="text-3xl">⚙️</span>
        <div>
          <h2 className="font-pixel text-base font-bold text-slate-800">
            앱 환경설정 & 데이터 관리 (SETTINGS)
          </h2>
          <p className="text-xs text-slate-600">
            사운드, 테마, 스트릭 규칙, 카테고리 추가 및 데이터 백업/복원을 관리하세요.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Profile & Work Settings */}
        <div className="pixel-box p-4 bg-white space-y-4">
          <div className="border-b pb-2">
            <h3 className="font-pixel text-xs font-bold text-slate-800">
              👤 프로필 & 기본 업무 규칙
            </h3>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">모험가 닉네임</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={nick}
                onChange={e => setNick(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg border text-xs"
                maxLength={12}
              />
              <button
                type="submit"
                className="pixel-btn px-3 py-1.5 rounded-lg bg-pink-500 text-white font-pixel text-xs font-bold"
              >
                저장
              </button>
            </div>
          </form>

          {/* Default Sorting */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">기본 정렬 기준</label>
            <select
              value={settings.defaultSort}
              onChange={e => updateSettings({ defaultSort: e.target.value as SortOption })}
              className="w-full px-3 py-1.5 rounded-lg border text-xs bg-white font-medium"
            >
              <option value="SMART">🎯 스마트 추천순</option>
              <option value="IMPORTANCE">🚨 중요도순</option>
              <option value="DUE_DATE">📅 마감일순</option>
              <option value="XP">⭐ 높은 XP순</option>
              <option value="DIFFICULTY">💪 난이도순</option>
              <option value="TIME">⏱️ 소요시간순</option>
            </select>
          </div>

          {/* Weekend Streak Toggle */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border">
            <div>
              <div className="text-xs font-bold text-slate-800">주말 스트릭 포함 여부</div>
              <div className="text-[11px] text-slate-500">
                주말(토/일) 퀘스트 미완료 시에도 스트릭을 유지할지 결정합니다.
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.weekendStreakIncluded}
              onChange={e => updateSettings({ weekendStreakIncluded: e.target.checked })}
              className="w-4 h-4 text-pink-500 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Sound & Animation */}
        <div className="pixel-box p-4 bg-white space-y-4">
          <div className="border-b pb-2">
            <h3 className="font-pixel text-xs font-bold text-slate-800">
              🔊 8-bit 효과음 & 인터랙션
            </h3>
          </div>

          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border">
            <div className="flex items-center gap-2">
              {settings.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-pink-500" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
              <span className="text-xs font-bold text-slate-800">8비트 레트로 효과음 활성화</span>
            </div>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={e => updateSettings({ soundEnabled: e.target.checked })}
              className="w-4 h-4 text-pink-500 rounded cursor-pointer"
            />
          </div>

          {/* Volume Slider */}
          {settings.soundEnabled && (
            <div className="space-y-1 p-2.5 rounded-xl bg-slate-50 border">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>효과음 볼륨</span>
                <span className="font-pixel">{Math.round(settings.soundVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.soundVolume}
                onChange={e => updateSettings({ soundVolume: Number(e.target.value) })}
                className="w-full accent-pink-500 cursor-pointer"
              />
            </div>
          )}

          {/* Animations Toggle */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold text-slate-800">레벨업 & 축하 폭죽 애니메이션</span>
            </div>
            <input
              type="checkbox"
              checked={settings.animationsEnabled}
              onChange={e => updateSettings({ animationsEnabled: e.target.checked })}
              className="w-4 h-4 text-pink-500 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Category Management */}
      <div className="pixel-box p-4 bg-white space-y-3">
        <div className="border-b pb-2">
          <h3 className="font-pixel text-xs font-bold text-slate-800">
            🏷️ 업무 카테고리 관리 ({categories.length}개)
          </h3>
        </div>

        {/* Existing Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map(c => (
            <div
              key={c.id}
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-medium ${c.badgeBg} ${c.badgeText}`}
            >
              <span>{c.icon}</span>
              <span>{c.name}</span>
            </div>
          ))}
        </div>

        {/* Add Category Form */}
        <form onSubmit={handleAddCategory} className="flex flex-wrap items-center gap-2 pt-2 border-t">
          <input
            type="text"
            value={newCatIcon}
            onChange={e => setNewCatIcon(e.target.value)}
            className="w-12 px-2 py-1.5 text-center border rounded-lg text-sm"
            placeholder="이모지"
            maxLength={2}
          />
          <input
            type="text"
            value={newCatName}
            onChange={e => setNewCatName(e.target.value)}
            className="flex-1 min-w-[140px] px-3 py-1.5 border rounded-lg text-xs"
            placeholder="새 카테고리 이름 (예: 인사/채용)"
            required
          />
          <button
            type="submit"
            className="pixel-btn px-3 py-1.5 rounded-lg bg-pink-500 text-white font-pixel text-xs font-bold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>카테고리 추가</span>
          </button>
        </form>
      </div>

      {/* Backup & Reset Area */}
      <div className="pixel-box p-4 bg-white space-y-3">
        <div className="border-b pb-2">
          <h3 className="font-pixel text-xs font-bold text-slate-800">
            💾 데이터 백업 및 복원 (EXPORT & IMPORT)
          </h3>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExport}
            className="pixel-btn px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-pixel text-xs font-bold flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>📤 데이터 백업 파일 다운로드 (JSON)</span>
          </button>

          <button
            onClick={() => setShowImportArea(!showImportArea)}
            className="pixel-btn px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-pixel text-xs font-bold flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span>📥 데이터 가져오기 (Import)</span>
          </button>

          <button
            onClick={handleReset}
            className="pixel-btn px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-pixel text-xs font-bold flex items-center gap-2 border border-rose-300 ml-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span>전체 데이터 초기화</span>
          </button>
        </div>

        {showImportArea && (
          <div className="mt-3 p-3 rounded-xl bg-slate-50 border space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              백업된 JSON 문자열을 붙여넣으세요:
            </label>
            <textarea
              rows={4}
              value={importText}
              onChange={e => setImportText(e.target.value)}
              placeholder="{'quests': [...], 'profile': {...}}"
              className="w-full p-2 border rounded-lg font-mono text-xs"
            ></textarea>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowImportArea(false)}
                className="px-3 py-1 bg-slate-200 rounded-lg text-xs font-bold text-slate-700"
              >
                닫기
              </button>
              <button
                type="button"
                onClick={handleImportSubmit}
                className="pixel-btn px-3 py-1 bg-emerald-500 rounded-lg text-xs font-pixel font-bold text-white"
              >
                복원 적용
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
