import { Injectable } from '@nestjs/common';
import moment from 'moment';
import * as puppeteer from 'puppeteer';
import { DATE_FORMATS } from '../utils/date';

let browser: puppeteer.Browser | null;
let isInitialized = false;
let isRunning = false;
let lastActiveTime: string;
const maxIdleTimeMin = 10;

@Injectable()
export class ScreenshotService {
  async initializeBrowser(): Promise<void> {
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor',
          '--disable-extensions',
          '--disable-plugins',
          '--memory-pressure-off',
          '--max-old-space-size=4096',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding',
        ],
        defaultViewport: {
          width: 1920,
          height: 1080,
          deviceScaleFactor: 1,
        },
      });
      isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize browser:', error);
      throw error;
    }
  }

  async ensureBrowserReady(): Promise<void> {
    if (!isInitialized) {
      await this.initializeBrowser();
    }

    if (!browser || !browser.isConnected()) {
      await this.initializeBrowser();
    }
  }

  async getScreenshot(res: any, url: string) {
    if (isRunning) {
      await this.waitUntilNotRunning();
      // return res.status(400).json({ error: 'Processing another request, please try again after a few moments!' });
    }

    try {
      isRunning = true;

      await this.ensureBrowserReady();

      // Navigate and capture with timeout protection
      const screenshot = await Promise.race([
        this.captureScreenshot(url),
        this.timeoutPromise(30000), // 30 second timeout
      ]);

      lastActiveTime = moment().format(DATE_FORMATS.DATE_TIME_SEC);

      if (!screenshot) {
        throw new Error('Screenshot capture timed out');
      }

      // Send response
      res.setHeader('Content-Type', 'image/png');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=screenshot.png`,
      );
      res.setHeader('Cache-Control', 'public, max-age=300'); // 5 minute cache
      res.send(screenshot);
    } catch (error) {
      if (browser) {
        browser.close();
        isInitialized = false;
        browser = null;
      }
      res.status(500).json({
        error: 'Failed to capture screenshot',
      });
    } finally {
      isRunning = false;
    }
  }

  async captureScreenshot(url: string) {
    const page = await browser?.newPage();
    try {
      await page?.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
      });

      await page?.goto(url, { waitUntil: 'networkidle0' });

      // Take screenshot with optimized settings
      const screenshot = await page?.screenshot({
        type: 'png',
        fullPage: false,
        omitBackground: false,
        captureBeyondViewport: false,
      });

      return screenshot;
    } catch (e) {
      console.error('captureScreenshot: ', e);
    } finally {
      if (page) {
        page.close();
      }
    }
  }

  timeoutPromise(ms: number): Promise<null> {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Operation timed out')), ms);
    });
  }

  async getRunStatus() {
    return { isRunning: isRunning || false };
  }

  async checkIdleTime() {
    const lastActive = moment(lastActiveTime, DATE_FORMATS.DATE_TIME_SEC);
    const now = moment();

    const time = now.diff(lastActive, 'minutes');
    if (time > maxIdleTimeMin) {
      if (browser) {
        browser.close();
        isInitialized = false;
        browser = null;
        isRunning = false;
      }
    }
  }

  async waitUntilNotRunning(checkIntervalMS = 1000): Promise<void> {
    return new Promise((resolve) => {
      const check = () => {
        if (!isRunning) {
          resolve();
        } else {
          setTimeout(check, checkIntervalMS);
        }
      };
      check();
    });
  }
}
