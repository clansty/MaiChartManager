using System;
using System.Linq;
using MaiLib;

namespace Sitreamai;

public class MusicXml
{
    public static string build(int musicId, SimaiTokenizer chart, out string strMusicId)
    {
        var parser = new SimaiParser();
        var candidate = parser.ChartOfToken(chart.ChartCandidates.Values.First());

        var isDx = chart.SimaiTrackInformation.IsDXChart || candidate.IsDxChart;

        var dxMusicId = musicId;
        if (isDx)
        {
            dxMusicId += 10000;
        }

        strMusicId = dxMusicId.ToString().PadLeft(6, '0');

        var trackLevels = (string[])chart.SimaiTrackInformation.TrackLevels.Clone();
        var trackDecimalLevels = (string[])chart.SimaiTrackInformation.TrackDecimalLevels.Clone();
        var trackLevelIds = new int[7];
        for (var i = 0; i < 7; i++)
        {
            if (string.IsNullOrEmpty(trackLevels[i]))
            {
                trackLevels[i] = "0";
            }
            else if (trackLevels[i].EndsWith("+"))
            {
                trackLevels[i] = trackLevels[i][..(trackLevels[i].Length - 1)];
                if (string.IsNullOrEmpty(trackDecimalLevels[i]))
                {
                    trackDecimalLevels[i] = "5";
                }
            }
            else if (trackLevels[i].Contains('.'))
            {
                var parts = trackLevels[i].Split('.');
                trackLevels[i] = parts[0];
                trackDecimalLevels[i] = parts[1];
            }

            if (string.IsNullOrEmpty(trackDecimalLevels[i]))
            {
                trackDecimalLevels[i] = "0";
            }

            trackLevelIds[i] = GetLevelId(int.Parse(trackLevels[i]) * 10 + int.Parse(trackDecimalLevels[i]));
        }

        var bpm = chart.SimaiTrackInformation.TrackBPM;
        if (string.IsNullOrEmpty(bpm))
        {
            bpm = candidate.BPMChanges.ChangeNotes[0].BPM.ToString();
        }

        var sortName = chart.SimaiTrackInformation.TrackSortName;
        if (string.IsNullOrEmpty(sortName))
        {
            sortName = "A";
        }

        return $"""
                <?xml version="1.0" encoding="utf-8"?>
                <MusicData xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
                  <dataName>music{strMusicId}</dataName>
                  <netOpenName>
                    <id>230922</id>
                    <str>Net230922</str>
                  </netOpenName>
                  <releaseTagName>
                    <id>4001</id>
                    <str>Ver1.40.00</str>
                  </releaseTagName>
                  <disable>false</disable>
                  <name>
                    <id>{dxMusicId}</id>
                    <str>{chart.SimaiTrackInformation.TrackName}</str>
                  </name>
                  <rightsInfoName>
                    <id>0</id>
                    <str />
                  </rightsInfoName>
                  <sortName>{sortName}</sortName>
                  <artistName>
                    <id>{musicId}</id>
                    <str>{chart.SimaiTrackInformation.TrackComposer}</str>
                  </artistName>
                  <genreName>
                    <id>101</id>
                    <str>POPSアニメ</str>
                  </genreName>
                  <bpm>{bpm}</bpm>
                  <version>22001</version>
                  <AddVersion>
                    <id>100</id>
                    <str>test</str>
                  </AddVersion>
                  <movieName>
                    <id>{musicId}</id>
                    <str>{chart.SimaiTrackInformation.TrackName}</str>
                  </movieName>
                  <cueName>
                    <id>{musicId}</id>
                    <str>{chart.SimaiTrackInformation.TrackName}</str>
                  </cueName>
                  <dresscode>false</dresscode>
                  <eventName>
                    <id>1</id>
                    <str>無期限常時解放</str>
                  </eventName>
                  <eventName2>
                    <id>0</id>
                    <str>解放なし</str>
                  </eventName2>
                  <subEventName>
                    <id>0</id>
                    <str>解放なし</str>
                  </subEventName>
                  <lockType>0</lockType>
                  <subLockType>{(trackLevels[5] == "0" ? 1 : 0)}</subLockType>
                  <dotNetListView>true</dotNetListView>
                  <notesData>
                    <Notes>
                      <file>
                        <path>{strMusicId}_00.ma2</path>
                      </file>
                      <level>{trackLevels[1]}</level>
                      <levelDecimal>{trackDecimalLevels[1]}</levelDecimal>
                      <notesDesigner>
                        <id>999</id>
                        <str/>
                      </notesDesigner>
                      <notesType>0</notesType>
                      <musicLevelID>{trackLevelIds[1]}</musicLevelID>
                      <maxNotes>0</maxNotes>
                      <isEnable>{(trackLevels[1] != "0" ? "true" : "false")}</isEnable>
                    </Notes>
                    <Notes>
                      <file>
                        <path>{strMusicId}_01.ma2</path>
                      </file>
                      <level>{trackLevels[2]}</level>
                      <levelDecimal>{trackDecimalLevels[2]}</levelDecimal>
                      <notesDesigner>
                        <id>999</id>
                        <str/>
                      </notesDesigner>
                      <notesType>0</notesType>
                      <musicLevelID>{trackLevelIds[2]}</musicLevelID>
                      <maxNotes>0</maxNotes>
                      <isEnable>{(trackLevels[2] != "0" ? "true" : "false")}</isEnable>
                    </Notes>
                    <Notes>
                      <file>
                        <path>{strMusicId}_02.ma2</path>
                      </file>
                      <level>{trackLevels[3]}</level>
                      <levelDecimal>{trackDecimalLevels[3]}</levelDecimal>
                      <notesDesigner>
                        <id>999</id>
                        <str/>
                      </notesDesigner>
                      <notesType>0</notesType>
                      <musicLevelID>{trackLevelIds[3]}</musicLevelID>
                      <maxNotes>0</maxNotes>
                      <isEnable>{(trackLevels[3] != "0" ? "true" : "false")}</isEnable>
                    </Notes>
                    <Notes>
                      <file>
                        <path>{strMusicId}_03.ma2</path>
                      </file>
                      <level>{trackLevels[4]}</level>
                      <levelDecimal>{trackDecimalLevels[4]}</levelDecimal>
                      <notesDesigner>
                        <id>999</id>
                        <str/>
                      </notesDesigner>
                      <notesType>0</notesType>
                      <musicLevelID>{trackLevelIds[4]}</musicLevelID>
                      <maxNotes>0</maxNotes>
                      <isEnable>{(trackLevels[4] != "0" ? "true" : "false")}</isEnable>
                    </Notes>
                     <Notes>
                      <file>
                        <path>{strMusicId}_04.ma2</path>
                      </file>
                      <level>{trackLevels[5]}</level>
                      <levelDecimal>{trackDecimalLevels[5]}</levelDecimal>
                      <notesDesigner>
                        <id>999</id>
                        <str/>
                      </notesDesigner>
                      <notesType>0</notesType>
                      <musicLevelID>{trackLevelIds[5]}</musicLevelID>
                      <maxNotes>0</maxNotes>
                      <isEnable>{(trackLevels[5] != "0" ? "true" : "false")}</isEnable>
                    </Notes>
                    <Notes>
                      <file>
                        <path>{strMusicId}_05.ma2</path>
                      </file>
                      <level>0</level>
                      <levelDecimal>0</levelDecimal>
                      <notesDesigner>
                        <id>999</id>
                        <str/>
                      </notesDesigner>
                      <notesType>0</notesType>
                      <musicLevelID>19</musicLevelID>
                      <maxNotes>0</maxNotes>
                      <isEnable>false</isEnable>
                    </Notes>
                 </notesData>
                  <utageKanjiName />
                  <comment />
                  <utagePlayStyle>0</utagePlayStyle>
                  <fixedOptions>
                    <FixedOption>
                      <_fixedOptionName />
                      <_fixedOptionValue />
                    </FixedOption>
                    <FixedOption>
                      <_fixedOptionName />
                      <_fixedOptionValue />
                    </FixedOption>
                    <FixedOption>
                      <_fixedOptionName />
                      <_fixedOptionValue />
                    </FixedOption>
                    <FixedOption>
                      <_fixedOptionName />
                      <_fixedOptionValue />
                    </FixedOption>
                  </fixedOptions>
                  <jacketFile />
                  <thumbnailName />
                  <rightFile />
                  <priority>0</priority>
                </MusicData>
                """;
    }

    public static int GetLevelId(int levelX10)
    {
        return levelX10 switch
        {
            >= 155 => 24,
            >= 150 => 23,
            >= 145 => 22,
            >= 140 => 21,
            >= 135 => 20,
            >= 130 => 19,
            >= 125 => 18,
            >= 120 => 17,
            >= 115 => 16,
            >= 110 => 15,
            >= 105 => 14,
            >= 100 => 13,
            >= 95 => 12,
            >= 90 => 11,
            >= 85 => 10,
            >= 80 => 9,
            >= 75 => 8,
            >= 0 => levelX10 / 10,
            _ => 0
        };
    }
}